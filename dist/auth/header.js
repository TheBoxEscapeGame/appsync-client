"use strict";
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
exports.headerBasedAuth = void 0;
const userAgent_1 = require("../userAgent");
function headerBasedAuth({ header, value }, operation, forward) {
    return __awaiter(this, void 0, void 0, function* () {
        const origContext = operation.getContext();
        let headers = Object.assign(Object.assign({}, origContext.headers), { [userAgent_1.USER_AGENT_HEADER]: userAgent_1.USER_AGENT });
        if (header && value) {
            const headerValue = typeof value === "function" ? yield value.call(undefined) : value;
            headers = Object.assign({ [header]: headerValue }, headers);
        }
        operation.setContext(Object.assign(Object.assign({}, origContext), { headers }));
        return forward(operation);
    });
}
exports.headerBasedAuth = headerBasedAuth;
