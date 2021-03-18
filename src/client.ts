import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { AuthLink } from "./authLink";
import { AuthOptions } from "./types";
import * as options from "./auth/options";

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
  fetch?: any;
  cache?: any;
}): ApolloClient<InMemoryCache> {
  const authLink = new AuthLink({ region, auth, url: uri });
  const httpLink = createHttpLink({ uri, fetch });
  const link = ApolloLink.from([authLink, httpLink]);
  return new ApolloClient({ link, cache });
}

export function fromAwsEnvironmentVariables({
  uri,
  region,
  fetch,
  cache = new InMemoryCache(),
}: {
  uri: string;
  region: string;
  fetch?: (
    input: RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  cache?: any;
}): ApolloClient<InMemoryCache> {
  return create({
    uri,
    region,
    fetch,
    cache,
    auth: options.fromAwsEnvironmentVariables(),
  });
}
