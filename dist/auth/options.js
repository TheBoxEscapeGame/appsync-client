"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAwsEnvironmentVariables = void 0;
function fromAwsEnvironmentVariables() {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, } = process.env;
    return {
        type: "AWS_IAM",
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            sessionToken: AWS_SESSION_TOKEN,
        },
    };
}
exports.fromAwsEnvironmentVariables = fromAwsEnvironmentVariables;
