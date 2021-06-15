import React from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Props } from "../types";

export default function Profile({ navigation, route }: Props<"Profile">) {
  if (route?.params?.username) {
    useEffect(() => {
      navigation.setOptions({
        title: route?.params?.username,
      });
    });
  }
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white" }}>Someones elses Profile</Text>
    </View>
  );
}
