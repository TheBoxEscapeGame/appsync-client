import { Operation, NextLink } from "@apollo/client/core";

import { USER_AGENT, USER_AGENT_HEADER } from "../userAgent";

interface Headers {
  header: string;
  value: string | (() => string | Promise<string>);
}

export async function headerBasedAuth(
  { header, value }: Headers,
  operation: Operation,
  forward: NextLink
) {
  const origContext = operation.getContext();
  let headers = {
    ...origContext.headers,
    [USER_AGENT_HEADER]: USER_AGENT,
  };

  if (header && value) {
    const headerValue =
      typeof value === "function" ? await value.call(undefined) : value;

    headers = {
      ...{ [header]: headerValue },
      ...headers,
    };
  }

  operation.setContext({
    ...origContext,
    headers,
  });

  return forward(operation);
}
