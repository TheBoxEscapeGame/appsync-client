import { AuthOptions } from "../types";

export function fromAwsEnvironmentVariables(): AuthOptions {
  const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN,
  } = process.env;
  return {
    type: "AWS_IAM",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID as string,
      secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
      sessionToken: AWS_SESSION_TOKEN,
    },
  };
}
