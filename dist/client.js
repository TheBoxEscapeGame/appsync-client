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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAwsEnvironmentVariables = exports.create = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const core_1 = require("@apollo/client/core");
const authLink_1 = require("./authLink");
const options = __importStar(require("./auth/options"));
function create({ uri, region, auth, fetch = cross_fetch_1.default, cache = new core_1.InMemoryCache(), }) {
    const authLink = new authLink_1.AuthLink({ region, auth, url: uri });
    const httpLink = core_1.createHttpLink({ uri, fetch });
    const link = core_1.ApolloLink.from([authLink, httpLink]);
    return new core_1.ApolloClient({ link, cache });
}
exports.create = create;
function fromAwsEnvironmentVariables({ uri, region, fetch = cross_fetch_1.default, cache = new core_1.InMemoryCache(), }) {
    return create({
        uri,
        region,
        fetch,
        cache,
        auth: options.fromAwsEnvironmentVariables(),
    });
}
exports.fromAwsEnvironmentVariables = fromAwsEnvironmentVariables;
