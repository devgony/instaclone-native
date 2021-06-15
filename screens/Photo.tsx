import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RefreshControl, View } from "react-native";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { Props } from "../types";
import { seePhoto } from "../__generated__/seePhoto";
import ScreenLayout from "../components/ScreenLayout";
import { ScrollView } from "react-native-gesture-handler";
import Photo from "../components/Photo";

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
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

export default function PhotoScreen({ route }: Props<"PhotoScreen">) {
  const { data, loading, refetch } = useQuery<seePhoto>(SEE_PHOTO, {
    variables: {
      id: route?.params?.photoId,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={{ backgroundColor: "black" }}
        contentContainerStyle={{
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data?.seePhoto?.caption && <Photo {...data.seePhoto} />}
      </ScrollView>
    </ScreenLayout>
  );
}
