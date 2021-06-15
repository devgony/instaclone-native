import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { USER_FRAGMENT } from "../fragments";
import UserRow from "../components/UserRow";
import ScreenLayout from "../components/ScreenLayout";
import { FlatList } from "react-native-gesture-handler";
import {
  seePhotoLikes,
  seePhotoLikes_seePhotoLikes,
} from "../__generated__/seePhotoLikes";
import { Props } from "../types";
import { useEffect } from "react";
import { View } from "react-native";

const LIKES_QUERY = gql`
  query seePhotoLikes($id: Int!) {
    seePhotoLikes(id: $id) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export default function Likes({ route }: Props<"Likes">) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch, error } = useQuery<seePhotoLikes>(
    LIKES_QUERY,
    {
      variables: {
        id: route?.params?.photoId,
      },
      skip: !route?.params?.photoId,
    }
  );
  console.log(loading, error, data);
  useEffect(() => {
    data?.seePhotoLikes?.map(a => {
      console.log(a);
    });
  }, [loading]);
  const renderUser = ({
    item: user,
  }: {
    item: seePhotoLikes_seePhotoLikes;
  }) => <UserRow {...user} />;
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          ></View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data?.seePhotoLikes}
        keyExtractor={item => "" + item.id}
        renderItem={renderUser}
        style={{ width: "100%" }}
      />
    </ScreenLayout>
  );
}
