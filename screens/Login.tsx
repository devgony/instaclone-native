import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigators/LoggedOutNav";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

export default function LogIn({ navigation }: Props) {
  return (
    <View>
      <Text>Login</Text>
      <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
        <Text>Go To Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
