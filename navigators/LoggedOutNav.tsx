import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateAccount from "../screens/CreateAccount";
import LogIn from "../screens/Login";
import Welcome from "../screens/Welcome";

export type RootStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  CreateAccount: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function LoggedOutNav() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
}
