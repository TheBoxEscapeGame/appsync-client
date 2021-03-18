import { Operation, NextLink } from "@apollo/client/core";
import * as Url from "url";
import { print, ASTNode } from "graphql";

import { AuthOptionsIAMCredentials } from "../types";
import { Signer } from "../signer";
import { USER_AGENT_HEADER, USER_AGENT } from "../userAgent";

type Map = { [key: string]: string };
type RequestOptions = Map & { headers?: Map };
type RequestOperation = {
  operationName: string;
  variables: Map;
  query: ASTNode;
};

/**
 * Removes all temporary variables (starting with '@@') so that the signature matches the final request.
 */
function removeTemporaryVariables(variables: Map) {
  return Object.keys(variables)
    .filter((key) => !key.startsWith("@@"))
    .reduce((acc: Map, key: string) => {
      acc[key] = variables[key];
      return acc;
    }, {});
}

function formatAsRequest(
  { operationName, variables, query }: RequestOperation,
  options: RequestOptions
) {
  const body = {
    operationName,
    variables: removeTemporaryVariables(variables),
    query: print(query),
  };

  return {
    body: JSON.stringify(body),
    method: "POST",
    ...options,
    headers: {
      accept: "*/*",
      "content-type": "application/json; charset=UTF-8",
      ...options.headers,
    },
  };
}

export async function iamBasedAuth(
  {
    credentials,
    region,
    url,
  }: { credentials: AuthOptionsIAMCredentials; region: string; url: string },
  operation: Operation,
  forward: NextLink
) {
  const origContext = operation.getContext();
  let authData =
    typeof credentials === "function"
      ? // @ts-ignore We know it's a function
        credentials.call()
      : credentials || {};

  // @ts-ignore
  if (authData && typeof authData.getPromise === "function") {
    // @ts-ignore
    await authData.getPromise();
  }

  // @ts-ignore
  const { accessKeyId, secretAccessKey, sessionToken } = await authData;

  const { host, path } = Url.parse(url);

  const formatted = {
    ...formatAsRequest(operation, {}),
    service: "appsync",
    region,
    url,
    host,
    path,
  };

  const { headers } = Signer.sign(formatted, {
    access_key: accessKeyId,
    secret_key: secretAccessKey,
    session_token: sessionToken,
  });

  operation.setContext({
    ...origContext,
    headers: {
      ...origContext.headers,
      ...headers,
      [USER_AGENT_HEADER]: USER_AGENT,
    },
  });

  return forward(operation);
}
