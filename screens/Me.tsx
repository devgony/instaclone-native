import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Props } from "../types";
import useMe from "../hooks/useMe";

export default function Me({ navigation }: Props<"Me">) {
  const { data } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: data?.me?.username,
    });
  }, [data]);
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Me</Text>
    </View>
  );
}
