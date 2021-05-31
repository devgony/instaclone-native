import React from "react";
import { GestureResponderEvent } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity`
  background-color: ${colors.blue};
  padding: 13px 10px;
  border-radius: 3px;
  width: 100%;
  opacity: ${props => (props.disabled ? "0.5" : "1")};
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  text-align: center;
`;

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  disabled: boolean;
  text: string;
};

export default function AuthButton({ onPress, disabled, text }: Props) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      <ButtonText>{text}</ButtonText>
    </Button>
  );
}
