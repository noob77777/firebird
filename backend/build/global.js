"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessage = exports.isUser = exports.redisClient = exports.log = void 0;
var simple_node_logger_1 = __importDefault(require("simple-node-logger"));
var redis_1 = __importDefault(require("redis"));
var constants_1 = require("./constants");
exports.log = simple_node_logger_1.default.createSimpleFileLogger(constants_1.LOG_FILE_PATH);
exports.redisClient = redis_1.default.createClient({
    host: constants_1.REDIS_HOST,
    port: constants_1.REDIS_PORT,
});
var isUser = function (o) {
    return "userName" in o && "hash" in o && "publicKey" in o && "contacts" in o;
};
exports.isUser = isUser;
var isMessage = function (o) {
    return ("timestamp" in o &&
        "id" in o &&
        "type" in o &&
        "sender" in o &&
        "receiver" in o &&
        "body" in o);
};
exports.isMessage = isMessage;
