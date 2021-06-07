import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
export const isLoggedInVar = makeVar(false);
const client = new ApolloClient({
  uri: process.env.URI_GQL,
  cache: new InMemoryCache(),
});

export default client;
if (process.env.URI_GQL) {
  // console.log(process.env.URI_GQL);
}
console.log(":+:+:+:+", process.env.URI_GQL);
