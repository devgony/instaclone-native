import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  LogIn: { username: string; password: string } | undefined;
  CreateAccount: undefined;
  Photo;
  Me;
  Profile;
  Search;
  Feed: undefined;
  Notifications;
};

export type Props<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
};