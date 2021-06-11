import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ICons } from "../../types/icons";

interface ITabIcon {
  iconName: ICons;
  color: string;
  focused: boolean;
}

export default function TabIcon({ iconName, color, focused }: ITabIcon) {
  return (
    <Ionicons
      name={focused ? iconName : (`${iconName}-outline` as ICons)}
      color={color}
      size={22}
    />
  );
}
