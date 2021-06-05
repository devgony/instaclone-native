import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { RootStackParamList } from "../navigators/LoggedOutNav";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

export default function LogIn({ navigation }: Props) {
  return (
    <AuthLayout>
      <TextInput
        placeholder="Username"
        returnKeyType="next"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
      />
    </AuthLayout>
  );
}
