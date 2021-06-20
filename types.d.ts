import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Welcome: undefined;
  LogIn: { username: string; password: string } | undefined;
  CreateAccount: undefined;
  PhotoScreen;
  Me;
  Profile;
  Search;
  Feed: undefined;
  Notifications;
  Likes;
  Comments;
  SelectPhoto;
  TakePhoto;
  Tabs;
};

export type Props<RouteName extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, RouteName>;
  route: RouteProp<RootStackParamList, RouteName>;
};
