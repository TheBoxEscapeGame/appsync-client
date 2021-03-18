/// <reference types="zen-observable" />
import { ApolloLink, Observable, Operation, NextLink } from "@apollo/client/core";
import { AuthOptions } from "./types";
declare type Options = {
    url: string;
    region: string;
    auth: AuthOptions;
};
export declare class AuthLink extends ApolloLink {
    private link;
    constructor(options: Options);
    request(operation: Operation, forward?: NextLink): Observable<import("@apollo/client/core").FetchResult<{
        [key: string]: any;
    }, Record<string, any>, Record<string, any>>> | null;
}
export declare function authLink({ url, region, auth }: Options): ApolloLink;
export {};
