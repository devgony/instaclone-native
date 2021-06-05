import React, { useEffect, useRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

interface IForm {
  data: { username: string; password: string };
}

export default function LogIn({ navigation }: Props) {
  const { register, handleSubmit, setValue } = useForm();
  const passwordRef = useRef(null);
  const onNext = (nextOne: React.RefObject<any>) => {
    nextOne?.current?.focus();
  };
  const onValid: SubmitHandler<IForm> = data => {
    console.log(data);
  };
  useEffect(() => {
    register("username");
    register("password");
  }, [register]);
  return (
    <AuthLayout>
      <TextInput
        placeholder="Username"
        returnKeyType="next"
        autoCapitalize="none"
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onSubmitEditing={() => onNext(passwordRef)}
        onChangeText={text => setValue("username", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={text => setValue("password", text)}
      />
      <AuthButton
        text="Log In"
        loading={true}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
