import { gql, MutationUpdaterFn, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { FlatList, KeyboardAvoidingView } from "react-native";
import { ListRenderItem, Text, View } from "react-native";
import styled from "styled-components/native";
import { Props } from "../types";
import { seeRoom, seeRoom_seeRoom_messages } from "../__generated__/seeRoom";
import ScreenLayout from "../components/ScreenLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import useMe from "../hooks/useMe";
import {
  sendMessage,
  sendMessageVariables,
  sendMessage_sendMessage,
} from "../__generated__/sendMessage";

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
  margin-bottom: 50px;
  width: 95%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 1000px;
`;

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
            return [...prev, messageFragment];
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
  const { data, loading } = useQuery<seeRoom>(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });
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
          style={{ width: "100%", paddingVertical: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
          data={data?.seeRoom?.messages as seeRoom_seeRoom_messages[]}
          keyExtractor={message => "" + message.id}
          renderItem={renderItem}
        />
        <TextInput
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          placeholder="Write a message..."
          returnKeyLabel="Send Message"
          returnKeyType="send"
          onChangeText={text => setValue("message", text)}
          onSubmitEditing={handleSubmit(onValid)}
          value={watch("message")}
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
