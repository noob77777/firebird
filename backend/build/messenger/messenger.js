"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
var constants_1 = require("../constants");
var auth_1 = __importDefault(require("../auth/auth"));
var MessengerState = /** @class */ (function () {
    function MessengerState() {
        var _this = this;
        this.socketStore = {};
        this.socketStoreIndex = {};
        this.addSocket = function (userName, socketId) {
            _this.socketStore[userName] = socketId;
            _this.socketStoreIndex[socketId] = userName;
        };
        this.removeSocket = function (socketId) {
            if (socketId in _this.socketStoreIndex) {
                var userName = _this.socketStoreIndex[socketId];
                delete _this.socketStore[userName];
                delete _this.socketStoreIndex[socketId];
            }
        };
        this.isUserActive = function (userName) {
            return userName in _this.socketStore;
        };
        this.getSocket = function (userName) {
            if (userName in _this.socketStore) {
                return _this.socketStore[userName];
            }
            return null;
        };
    }
    return MessengerState;
}());
var messengerState = new MessengerState();
/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param callback
 */
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
var enQueue = function (receiver, message, callback) {
    auth_1.default.userExists(receiver, function (exists) {
        if (exists) {
            var queue = receiver + "." + constants_1.QUEUE_SUFFIX;
            global_1.redisClient.rpush(queue, JSON.stringify(message), function (err) {
                if (err) {
                    global_1.log.error(err.message);
                    callback(false);
                    return;
                }
                callback(true);
            });
        }
        else {
            callback(false);
        }
    });
};
/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param socketID
 */
var addClient = function (userName, sessionKey, socketID) {
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        if (success) {
            messengerState.addSocket(userName, socketID);
        }
    });
};
/**
 * @param socketID
 */
var removeClient = function (socketID) {
    messengerState.removeSocket(socketID);
};
/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param message
 * @param callback
 */
var sendMessage = function (userName, sessionKey, message, callback) {
    if (userName !== message.sender) {
        callback(false);
        return;
    }
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        if (success) {
            if (messengerState.isUserActive(message.receiver)) {
                var socketId = messengerState.getSocket(message.receiver);
                if (!socketId) {
                    callback(false);
                    return;
                }
                global_1.io.to(socketId).emit(constants_1.RECV_MESSAGE, JSON.stringify(message));
                callback(true);
            }
            else {
                enQueue(message.receiver, message, callback);
            }
        }
        else {
            callback(false);
        }
    });
};
var messenger = { pendingMessages: pendingMessages, sendMessage: sendMessage, addClient: addClient, removeClient: removeClient };
exports.default = messenger;
