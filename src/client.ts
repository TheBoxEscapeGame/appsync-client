import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { AuthLink } from "./authLink";
import { AuthOptions } from "./types";

export function create({
  uri,
  region,
  auth,
  fetch,
  cache = new InMemoryCache(),
}: {
  uri: string;
  region: string;
  auth: AuthOptions;
  fetch?: (
    input: RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  cache?: any;
}): ApolloClient<InMemoryCache> {
  const authLink = new AuthLink({ region, auth, url: uri });
  const httpLink = createHttpLink({ uri, fetch });
  const link = ApolloLink.from([authLink, httpLink]);
  return new ApolloClient({ link, cache });
}
