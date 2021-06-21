import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Props } from "../types";
import DismissKeyboard from "../components/DismissKeyboard";
import { colors } from "../color";
import { FEED_PHOTO } from "../fragments";
import { gql, MutationUpdaterFn, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import {
  uploadPhoto,
  uploadPhotoVariables,
} from "../__generated__/uploadPhoto";

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  padding: 0px 50px;
`;
const Photo = styled.Image`
  height: 350px;
`;
const CaptionContainer = styled.View`
  margin-top: 30px;
`;
const Caption = styled.TextInput`
  background-color: white;
  color: black;
  padding: 10px 20px;
  border-radius: 100px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

export default function UploadForm({ route, navigation }: Props<"UploadForm">) {
  const updateUploadPhoto: MutationUpdaterFn<uploadPhoto> = (cache, result) => {
    if (result.data?.uploadPhoto?.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            return [result.data?.uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };
  const [uploadPhotoMutation, { loading, error }] = useMutation<
    uploadPhoto,
    uploadPhotoVariables
  >(UPLOAD_PHOTO_MUTATION, {
    update: updateUploadPhoto,
  });
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );
  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />
  );
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    register("caption");
  }, [register]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);
  const onValid: SubmitHandler<{ caption: string }> = ({ caption }) => {
    const file = new ReactNativeFile({
      uri: route.params?.file,
      name: `1.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };
  console.log(error);
  return (
    <DismissKeyboard>
      <Container>
        {route.params?.file && (
          <Photo resizeMode="contain" source={{ uri: route.params.file }} />
        )}
        <CaptionContainer>
          <Caption
            returnKeyType="done"
            placeholder="Write a caption..."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            onSubmitEditing={handleSubmit(onValid)}
            onChangeText={text => setValue("caption", text)}
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
}
