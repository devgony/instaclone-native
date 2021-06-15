import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import styled from "styled-components/native";
import { Props } from "../types";
import DismissKeyboard from "../components/DismissKeyboard";

const Input = styled.TextInput``;

export default function Search({ navigation }: Props<"Search">) {
  const { setValue, register } = useForm();
  const SearchBox = () => (
    <TextInput
      style={{ backgroundColor: "white" }}
      placeholderTextColor="black"
      placeholder="Search photos"
      autoCapitalize="none"
      returnKeyLabel="Search" // android
      returnKeyType="search" // ios
      autoCorrect={false}
      onChangeText={text => setValue("keyword", text)}
    />
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword");
  }, []);

  return (
    <DismissKeyboard>
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white" }}>Photo</Text>
      </View>
    </DismissKeyboard>
  );
}
