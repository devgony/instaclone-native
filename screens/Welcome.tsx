import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import styled from "styled-components/native";
import { colors } from "../color";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 20px;
`;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

export default function Welcome({ navigation }: Props) {
  const goToCreateAccount = () => navigation.navigate("CreateAccount");
  const goToLogIn = () => navigation.navigate("LogIn");
  return (
    <AuthLayout>
      <AuthButton
        text="Crate New Account"
        disabled={false}
        onPress={goToCreateAccount}
      />
      <TouchableOpacity onPress={goToLogIn}>
        <LoginLink>Log In</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  );
}
