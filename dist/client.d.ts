import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { AuthOptions } from "./types";
export declare function create({ uri, region, auth, fetch, cache, }: {
    uri: string;
    region: string;
    auth: AuthOptions;
    fetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    cache?: any;
}): ApolloClient<InMemoryCache>;
export declare function fromAwsEnvironmentVariables({ uri, region, fetch, cache, }: {
    uri: string;
    region: string;
    fetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    cache?: any;
}): ApolloClient<InMemoryCache>;
