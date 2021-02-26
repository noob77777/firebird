"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMessage = exports.isUser = exports.io = exports.serverHTTPS = exports.serverHTTP = exports.app = exports.redisClient = exports.log = void 0;
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var simple_node_logger_1 = __importDefault(require("simple-node-logger"));
var redis_1 = __importDefault(require("redis"));
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var constants_1 = require("./constants");
exports.log = simple_node_logger_1.default.createSimpleFileLogger(constants_1.LOG_FILE_PATH);
exports.redisClient = redis_1.default.createClient({
    host: constants_1.REDIS_HOST,
    port: constants_1.REDIS_PORT,
});
var key = fs_1.default.readFileSync(constants_1.SSL_KEY_PATH);
var cert = fs_1.default.readFileSync(constants_1.SSL_CERT_PATH);
var options = {
    key: key,
    cert: cert,
};
exports.app = express_1.default();
exports.serverHTTP = http_1.default.createServer(exports.app);
exports.serverHTTPS = https_1.default.createServer(options, exports.app);
exports.io = new socket_io_1.Server();
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
