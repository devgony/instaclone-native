import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login_login } from "./__generated__/login";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token: string) => {
  await AsyncStorage.multiSet([
    ["token", token],
    ["loggedIn", "yes"], // just for practice
  ]);
  isLoggedInVar(true);
  tokenVar(token);
};

const client = new ApolloClient({
  uri: "https://ninstaclone.loca.lt/graphql",
  cache: new InMemoryCache(),
});

export default client;
