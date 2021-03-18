/// <reference types="zen-observable" />
import { Operation, NextLink } from "@apollo/client/core";
import { AuthOptionsIAMCredentials } from "../types";
export declare function iamBasedAuth({ credentials, region, url, }: {
    credentials: AuthOptionsIAMCredentials;
    region: string;
    url: string;
}, operation: Operation, forward: NextLink): Promise<import("zen-observable")<import("@apollo/client/core").FetchResult<{
    [key: string]: any;
}, Record<string, any>, Record<string, any>>>>;
