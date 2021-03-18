import { Credentials, CredentialsOptions } from "aws-sdk/lib/credentials";
export declare enum AUTH_TYPE {
    NONE = "NONE",
    AWS_IAM = "AWS_IAM",
    API_KEY = "API_KEY",
    AMAZON_COGNITO_USER_POOLS = "AMAZON_COGNITO_USER_POOLS",
    OPENID_CONNECT = "OPENID_CONNECT"
}
declare type KeysWithType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];
declare type AuthOptionsNone = {
    type: AUTH_TYPE.NONE;
};
export declare type AuthOptionsIAMCredentials = (() => Credentials | CredentialsOptions | Promise<Credentials | CredentialsOptions | null>) | Credentials | CredentialsOptions | null;
export declare type AuthOptionsIAM = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AWS_IAM>;
    credentials: AuthOptionsIAMCredentials;
};
declare type AuthOptionsApiKey = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.API_KEY>;
    apiKey: (() => string | Promise<string>) | string;
};
declare type AuthOptionsOAuth = {
    type: KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.AMAZON_COGNITO_USER_POOLS> | KeysWithType<typeof AUTH_TYPE, AUTH_TYPE.OPENID_CONNECT>;
    jwtToken: (() => string | Promise<string>) | string;
};
export declare type AuthOptions = AuthOptionsIAM | AuthOptionsNone | AuthOptionsApiKey | AuthOptionsOAuth;
export {};
