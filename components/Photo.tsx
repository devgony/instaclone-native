import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Image, useWindowDimensions } from "react-native";
import { seeFeed_seeFeed } from "../__generated__/seeFeed";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Container = styled.View``;
const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
`;
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View``;
const Action = styled.TouchableOpacity``;
const Caption = styled.View``;
const CaptionText = styled.Text`
  color: white;
`;
const Likes = styled.Text`
  color: white;
`;

export default function Photo({
  id,
  user,
  caption,
  file,
  isLiked,
  likes,
}: seeFeed_seeFeed) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height);
      //   setImageHeight(height / 3);
    });
  }, [file]);
  return (
    <Container>
      <Header onPress={() => navigation.navigate("Profile")}>
        {user.avatar && (
          <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        )}
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <Actions>
        <Action />
        <Action />
      </Actions>
      <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
      <Caption>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Username>{user.username}</Username>
        </TouchableOpacity>
        <CaptionText>{caption}</CaptionText>
      </Caption>
    </Container>
  );
}
