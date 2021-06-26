import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login_login } from "./__generated__/login";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token: string) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar("");
};

const uploadHttpLink = createUploadLink({
  uri: "https://instaclone-backend-henry.herokuapp.com/graphql",
  // uri: "http://ninstaclone-henry.loca.lt/graphql",
  // uri: "http://localhost:4001/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://instaclone-backend-henry.herokuapp.com/graphql",
  // uri: "ws://ninstaclone-henry.loca.lt/graphql",
  options: {
    connectionParams: () => ({
      token: tokenVar(),
    }),
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
