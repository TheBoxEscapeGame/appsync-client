"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFromAwsEnvironmentVariables = exports.create = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "create", { enumerable: true, get: function () { return client_1.create; } });
Object.defineProperty(exports, "createFromAwsEnvironmentVariables", { enumerable: true, get: function () { return client_1.fromAwsEnvironmentVariables; } });
