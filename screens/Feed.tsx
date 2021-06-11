import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { logUserOut } from "../apollo";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Props } from "../types";
import { seeFeed, seeFeed_seeFeed } from "../__generated__/seeFeed";
import ScreenLayout from "../components/ScreenLayout";

const SEE_FEED = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
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
  const { data, loading } = useQuery<seeFeed>(SEE_FEED);
  const renderPhoto = ({ item: photo }: { item: seeFeed_seeFeed }) => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white" }}>{photo.caption}</Text>
      </View>
    );
  };
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={data?.seeFeed}
        keyExtractor={photo => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
