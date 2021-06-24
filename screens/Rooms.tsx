import { gql, useQuery } from "@apollo/client";
import React from "react";
import { ListRenderItem, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { ROOM_FRAGMENT } from "../fragments";
import { seeRooms, seeRooms_seeRooms } from "../__generated__/seeRooms";
import ScreenLayout from "../components/ScreenLayout";
import { useEffect } from "react";
import useMe from "../hooks/useMe";
import { colors } from "../color";
import RoomItem from "../components/rooms/RoomItem";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

export default function Rooms() {
  const { data, loading } = useQuery<seeRooms>(SEE_ROOMS_QUERY);
  const renderItem: ListRenderItem<seeRooms_seeRooms> = ({ item: room }) => (
    <RoomItem {...room} />
  );
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
        style={{ width: "100%" }}
        data={data?.seeRooms}
        keyExtractor={room => "" + room.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
}
