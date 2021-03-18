"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLink = exports.AuthLink = void 0;
const core_1 = require("@apollo/client/core");
const types_1 = require("./types");
const header_1 = require("./auth/header");
const iam_1 = require("./auth/iam");
class AuthLink extends core_1.ApolloLink {
    constructor(options) {
        super();
        this.link = authLink(options);
    }
    request(operation, forward) {
        return this.link.request(operation, forward);
    }
}
exports.AuthLink = AuthLink;
function authLink({ url, region, auth }) {
    return new core_1.ApolloLink((operation, forward) => {
        return new core_1.Observable((observer) => {
            let handle;
            let promise;
            switch (auth.type) {
                case types_1.AUTH_TYPE.NONE:
                    promise = header_1.headerBasedAuth({ header: "", value: "" }, operation, forward);
                    break;
                case types_1.AUTH_TYPE.AWS_IAM:
                    const { credentials } = auth;
                    promise = iam_1.iamBasedAuth({ credentials, region, url }, operation, forward);
                    break;
                case types_1.AUTH_TYPE.API_KEY:
                    promise = header_1.headerBasedAuth({ header: "X-Api-Key", value: auth.apiKey }, operation, forward);
                    break;
                case types_1.AUTH_TYPE.AMAZON_COGNITO_USER_POOLS:
                case types_1.AUTH_TYPE.OPENID_CONNECT:
                    promise = header_1.headerBasedAuth({ header: "Authorization", value: auth.jwtToken }, operation, forward);
                    break;
                default:
                    throw new Error(`Invalid AUTH_TYPE: ${auth.type}`);
            }
            promise.then((observable) => {
                handle = observable.subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            });
            return () => {
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
}
exports.authLink = authLink;
