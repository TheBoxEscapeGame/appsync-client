import {
  ApolloLink,
  Observable,
  ObservableSubscription,
  Operation,
  NextLink,
} from "@apollo/client/core";

import { AuthOptions, AUTH_TYPE } from "./types";
import { headerBasedAuth } from "./auth/header";
import { iamBasedAuth } from "./auth/iam";

type Options = {
  url: string;
  region: string;
  auth: AuthOptions;
};

export class AuthLink extends ApolloLink {
  private link: ApolloLink;

  constructor(options: Options) {
    super();
    this.link = authLink(options);
  }

  request(operation: Operation, forward?: NextLink) {
    return this.link.request(operation, forward);
  }
}

export function authLink({ url, region, auth }: Options) {
  return new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let handle: ObservableSubscription;
      let promise: Promise<Observable<any>>;

      switch (auth.type) {
        case AUTH_TYPE.NONE:
          promise = headerBasedAuth(
            { header: "", value: "" },
            operation,
            forward
          );
          break;

        case AUTH_TYPE.AWS_IAM:
          const { credentials } = auth;
          promise = iamBasedAuth(
            { credentials, region, url },
            operation,
            forward
          );
          break;

        case AUTH_TYPE.API_KEY:
          promise = headerBasedAuth(
            { header: "X-Api-Key", value: auth.apiKey },
            operation,
            forward
          );
          break;

        case AUTH_TYPE.AMAZON_COGNITO_USER_POOLS:
        case AUTH_TYPE.OPENID_CONNECT:
          promise = headerBasedAuth(
            { header: "Authorization", value: auth.jwtToken },
            operation,
            forward
          );
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
        if (handle) handle.unsubscribe();
      };
    });
  });
}