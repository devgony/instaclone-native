import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

interface IForm {
  data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  };
}

export default function CreateAccount() {
  const onCompleted = () => {};
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const { register, handleSubmit, setValue } = useForm();
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const onNext = (nextOne: React.RefObject<any>) => {
    nextOne?.current?.focus();
  };
  const onValid: SubmitHandler<IForm> = data => {
    createAccountMutation({ variables: { ...data } });
  };
  useEffect(() => {
    register("firstName", { required: true });
    register("lastName", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);
  return (
    <AuthLayout>
      <TextInput
        placeholder="First Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(lastNameRef)}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onChangeText={text => setValue("firstName", text)}
      />
      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        returnKeyType="next"
        onSubmitEditing={() => onNext(usernameRef)}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onChangeText={text => setValue("lastName", text)}
      />
      <TextInput
        ref={usernameRef}
        placeholder="Username"
        returnKeyType="next"
        autoCapitalize="none"
        onSubmitEditing={() => onNext(emailRef)}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onChangeText={text => setValue("username", text)}
      />
      <TextInput
        ref={emailRef}
        placeholder="Email"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => onNext(passwordRef)}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onChangeText={text => setValue("email", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="Password"
        secureTextEntry // masking + no shift
        returnKeyType="done"
        onSubmitEditing={handleSubmit(onValid)}
        lastOne={true}
        placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
        onChangeText={text => setValue("password", text)}
      />
      <AuthButton
        text="Create Account"
        loading={true}
        onPress={handleSubmit(onValid)}
      />
    </AuthLayout>
  );
}
