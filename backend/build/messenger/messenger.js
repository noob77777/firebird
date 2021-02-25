"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
var constants_1 = require("../constants");
var auth_1 = __importDefault(require("../auth/auth"));
var pendingMessages = function (userName, sessionKey, callback) {
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        var queueName = userName + "." + constants_1.QUEUE_SUFFIX;
        if (success) {
            global_1.redisClient.lrange(queueName, 0, -1, function (errLRange, result) {
                if (errLRange) {
                    global_1.log.error(errLRange.message);
                    callback(null);
                    return;
                }
                var ret = result.map(function (x) { return JSON.parse(x); }).filter(global_1.isMessage);
                global_1.redisClient.ltrim(queueName, ret.length, -1, function (errLTrim) {
                    if (errLTrim) {
                        global_1.log.error(errLTrim.message);
                    }
                });
                callback(ret);
            });
        }
        else {
            callback(null);
        }
    });
};
var sendMessage = function (userName, sessionKey, message, callback) {
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        if (success) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
};
var messenger = { pendingMessages: pendingMessages };
exports.default = messenger;
