import {
  gql,
  MutationUpdaterFn,
  Reference,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView } from "react-native";
import { ListRenderItem, Text, View } from "react-native";
import styled from "styled-components/native";
import { Props } from "../types";
import {
  seeRoom,
  seeRoomVariables,
  seeRoom_seeRoom_messages,
} from "../__generated__/seeRoom";
import ScreenLayout from "../components/ScreenLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import useMe from "../hooks/useMe";
import {
  sendMessage,
  sendMessageVariables,
  sendMessage_sendMessage,
} from "../__generated__/sendMessage";
import { Ionicons } from "@expo/vector-icons";
import { logUserOut } from "../apollo";
import { UpdateQueryFn } from "@apollo/client/core/watchQueryOptions";
import {
  roomUpdates,
  roomUpdatesVariables,
} from "../__generated__/roomUpdates";

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

const MessageContainer = styled.View<{ outGoing: boolean }>`
  padding: 0px 10px;
  flex-direction: ${props => (props.outGoing ? "row-reverse" : "row")};
  align-items: flex-end;
`;
const Author = styled.View``;
const Avatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 25px;
  background-color: gray;
`;

const Message = styled.Text`
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;

const TextInput = styled.TextInput`
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 1000px;
  width: 90%;
  margin-right: 10px;
`;

const InputContainer = styled.View`
  width: 95%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;

const SendButton = styled.TouchableOpacity``;

export default function Room({ route, navigation }: Props<"Room">) {
  const { data: meData } = useMe();
  const { register, setValue, handleSubmit, getValues, watch } = useForm();
  const updateSendMessage: MutationUpdaterFn<sendMessage> = (cache, result) => {
    if (result.data?.sendMessage?.ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id: result.data?.sendMessage?.id,
        payload: message,
        user: {
          username: meData?.me?.username,
          avatar: meData?.me?.avatar,
        },
        read: true,
        __typename: "Message",
      };
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });
      cache.modify({
        id: `Room:${route?.params?.id}`,
        fields: {
          messages(prev) {
            return [messageFragment, ...prev];
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation<
    sendMessage,
    sendMessageVariables
  >(SEND_MESSAGE_MUTATION, {
    update: updateSendMessage,
  });
  const { data, loading, subscribeToMore } = useQuery<
    seeRoom,
    seeRoomVariables
  >(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
  const client = useApolloClient();
  const updateQuery: UpdateQueryFn<seeRoom, roomUpdatesVariables, roomUpdates> =
    (prevQuery, options) => {
      const message = options.subscriptionData.data.roomUpdates;
      const existingMessage = prevQuery?.seeRoom?.messages?.find(
        aMessage => aMessage?.id === message?.id
      );
      if (message?.id && !existingMessage) {
        return {
          seeRoom: {
            ...prevQuery.seeRoom,
            messages: [message, ...(prevQuery.seeRoom?.messages ?? [])],
          },
        } as seeRoom;
      } else {
        return prevQuery;
      }
    };

  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore<roomUpdates, roomUpdatesVariables>({
        document: ROOM_UPDATES,
        variables: {
          id: route?.params?.id,
        },
        updateQuery,
      });
    }
  }, [data]);

  const onValid: SubmitHandler<{ message: sendMessageVariables["payload"] }> =
    ({ message: payload }) => {
      if (!sendingMessage) {
        sendMessageMutation({
          variables: {
            payload,
            roomId: route?.params?.id,
          },
        });
      }
    };

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);

  const renderItem: ListRenderItem<seeRoom_seeRoom_messages> = ({
    item: message,
  }) => (
    <MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar as string }} />
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          inverted
          style={{ width: "100%", marginVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
          data={data?.seeRoom?.messages as seeRoom_seeRoom_messages[]}
          keyExtractor={message => "" + message.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        <InputContainer>
          <TextInput
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            placeholder="Write a message..."
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onChangeText={text => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}
          >
            <Ionicons
              name="send"
              color={
                !Boolean(watch("message"))
                  ? "rgba(255, 255, 255, 0.5)"
                  : "white"
              }
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
