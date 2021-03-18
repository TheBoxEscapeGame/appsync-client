/// <reference types="zen-observable" />
import { Operation, NextLink } from "@apollo/client/core";
interface Headers {
    header: string;
    value: string | (() => string | Promise<string>);
}
export declare function headerBasedAuth({ header, value }: Headers, operation: Operation, forward: NextLink): Promise<import("zen-observable")<import("@apollo/client/core").FetchResult<{
    [key: string]: any;
}, Record<string, any>, Record<string, any>>>>;
export {};
