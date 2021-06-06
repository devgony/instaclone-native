import React, { useEffect, useRef } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import { RootStackParamList } from "../navigators/LoggedOutNav";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { login, loginVariables } from "../__generated__/login";
import { isLoggedInVar } from "../apollo";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

type Props = {
  navigation: StackNavigationProp<RootStackParamList, "Welcome">;
};

export default function LogIn({ navigation }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const passwordRef = useRef(null);
  const onCompleted = (data: login) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok) {
      isLoggedInVar(true);
      console.log(token);
    }
    console.log(error);
  };
  const [logInMutation, { loading }] = useMutation<login, loginVariables>(
    LOGIN_MUTATION,
    {
      onCompleted,
    }
  );
  const onNext = (nextOne: React.RefObject<any>) => {
    nextOne?.current?.focus();
  };
  const onValid: SubmitHandler<loginVariables> = data => {
    if (!loading) {
      logInMutation({
        variables: { ...data },
      });
    }
  };
  useEffect(() => {
    register("username", { required: true });
    register("password", { required: true });
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
        loading={loading}
        disabled={!watch("username") || !watch("password")}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
