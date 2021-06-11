import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Props } from "../types";

export default function Search({ navigation }: Props<"Search">) {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Photo")}>
        <Text style={{ color: "white" }}>Photo</Text>
      </TouchableOpacity>
    </View>
  );
}
