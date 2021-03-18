"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const core_1 = require("@apollo/client/core");
const authLink_1 = require("./authLink");
function create({ uri, region, auth, fetch, cache = new core_1.InMemoryCache(), }) {
    const authLink = new authLink_1.AuthLink({ region, auth, url: uri });
    const httpLink = core_1.createHttpLink({ uri, fetch });
    const link = core_1.ApolloLink.from([authLink, httpLink]);
    return new core_1.ApolloClient({ link, cache });
}
exports.create = create;
