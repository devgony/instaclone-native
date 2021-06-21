import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { logUserOut } from "../apollo";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Props } from "../types";
import { seeFeed, seeFeed_seeFeed } from "../__generated__/seeFeed";
import ScreenLayout from "../components/ScreenLayout";
import Photo from "../components/Photo";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SEE_FEED = gql`
  query seeFeed($offset: Int) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default function Feed({ navigation }: Props<"Feed">) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<seeFeed>(SEE_FEED, {
    variables: {
      offset: 0,
    },
  });
  const renderPhoto = ({ item: photo }: { item: seeFeed_seeFeed }) => {
    return <Photo {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const MessagesButton = () => (
    <TouchableOpacity
      style={{ marginRight: 25 }}
      onPress={() => navigation.navigate("Messages")}
    >
      <Ionicons name="paper-plane" color="white" size={20} />
    </TouchableOpacity>
  );
  useEffect(() => {
    navigation.setOptions({
      headerRight: MessagesButton,
    });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
        // refreshing={refreshing}
        onRefresh={refetch}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={photo => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
