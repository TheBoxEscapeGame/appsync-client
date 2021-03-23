import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { AuthOptions } from "./types";
export declare function create({ uri, region, auth, fetch, cache, connectToDevTools, }: {
    uri: string;
    region: string;
    auth: AuthOptions;
    fetch?: any;
    cache?: any;
    connectToDevTools?: boolean;
}): ApolloClient<InMemoryCache>;
export declare function fromAwsEnvironmentVariables({ uri, region, fetch, cache, }: {
    uri: string;
    region: string;
    fetch?: any;
    cache?: any;
}): ApolloClient<InMemoryCache>;
