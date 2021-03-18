"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iamBasedAuth = void 0;
const Url = __importStar(require("url"));
const graphql_1 = require("graphql");
const signer_1 = require("../signer");
const userAgent_1 = require("../userAgent");
/**
 * Removes all temporary variables (starting with '@@') so that the signature matches the final request.
 */
function removeTemporaryVariables(variables) {
    return Object.keys(variables)
        .filter((key) => !key.startsWith("@@"))
        .reduce((acc, key) => {
        acc[key] = variables[key];
        return acc;
    }, {});
}
function formatAsRequest({ operationName, variables, query }, options) {
    const body = {
        operationName,
        variables: removeTemporaryVariables(variables),
        query: graphql_1.print(query),
    };
    return Object.assign(Object.assign({ body: JSON.stringify(body), method: "POST" }, options), { headers: Object.assign({ accept: "*/*", "content-type": "application/json; charset=UTF-8" }, options.headers) });
}
function iamBasedAuth({ credentials, region, url, }, operation, forward) {
    return __awaiter(this, void 0, void 0, function* () {
        const origContext = operation.getContext();
        let authData = typeof credentials === "function"
            ? // @ts-ignore We know it's a function
                credentials.call()
            : credentials || {};
        // @ts-ignore
        if (authData && typeof authData.getPromise === "function") {
            // @ts-ignore
            yield authData.getPromise();
        }
        // @ts-ignore
        const { accessKeyId, secretAccessKey, sessionToken } = yield authData;
        const { host, path } = Url.parse(url);
        const formatted = Object.assign(Object.assign({}, formatAsRequest(operation, {})), { service: "appsync", region,
            url,
            host,
            path });
        const { headers } = signer_1.Signer.sign(formatted, {
            access_key: accessKeyId,
            secret_key: secretAccessKey,
            session_token: sessionToken,
        });
        operation.setContext(Object.assign(Object.assign({}, origContext), { headers: Object.assign(Object.assign(Object.assign({}, origContext.headers), headers), { [userAgent_1.USER_AGENT_HEADER]: userAgent_1.USER_AGENT }) }));
        return forward(operation);
    });
}
exports.iamBasedAuth = iamBasedAuth;
