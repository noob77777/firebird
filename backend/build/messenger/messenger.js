"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
var constants_1 = require("../constants");
var auth_1 = __importDefault(require("../auth/auth"));
var MessengerState = (function () {
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
        this.getUser = function (socketId) {
            if (socketId in _this.socketStoreIndex) {
                return _this.socketStoreIndex[socketId];
            }
            return null;
        };
    }
    return MessengerState;
}());
var messengerState = new MessengerState();
var addClient = function (userName, sessionKey, socketID) {
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        if (success) {
            messengerState.addSocket(userName, socketID);
            global_1.io.sockets.emit(constants_1.USER_STATE_CHANGE, JSON.stringify({ userName: userName, active: true }));
        }
    });
};
var getClient = function (socketID) {
    var userName = messengerState.getUser(socketID);
    return userName;
};
var removeClient = function (socketID) {
    var userName = messengerState.getUser(socketID);
    messengerState.removeSocket(socketID);
    if (userName) {
        global_1.io.sockets.emit(constants_1.USER_STATE_CHANGE, JSON.stringify({ userName: userName, active: false }));
    }
};
var pendingMessages = function (userName, sessionKey, callback) {
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        var queueName = userName + constants_1.QUEUE_SUFFIX;
        if (success) {
            global_1.redisClient.watch(queueName, function (errWatch) {
                if (errWatch) {
                    global_1.log.error(errWatch);
                    callback(null);
                    return;
                }
                global_1.redisClient.lrange(queueName, 0, -1, function (errLRange, result) {
                    if (errLRange) {
                        global_1.log.error(errLRange.message);
                        callback(null);
                        return;
                    }
                    var ret = result.map(function (x) { return JSON.parse(x); }).filter(global_1.isMessage);
                    global_1.redisClient
                        .multi()
                        .ltrim(queueName, result.length, -1)
                        .exec(function (errExec) {
                        if (errExec) {
                            global_1.log.error(errExec.message);
                            return;
                        }
                    });
                    callback(ret);
                });
            });
        }
        else {
            callback(null);
        }
    });
};
var enQueueMessage = function (receiver, message, callback) {
    auth_1.default.userExists(receiver, function (exists) {
        if (exists) {
            var queueName = receiver + constants_1.QUEUE_SUFFIX;
            global_1.redisClient.rpush(queueName, JSON.stringify(message), function (err) {
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
var sendAck = function (userName, messageId, success) {
    var ack = {
        timestamp: Date.now(),
        id: messageId,
        type: constants_1.TYPE_ACK,
        sender: constants_1.USER_SERVER,
        receiver: userName,
        body: success,
    };
    var client = messengerState.getSocket(userName);
    if (client) {
        global_1.io.to(client).emit(constants_1.ACK_MESSAGE, JSON.stringify(ack));
    }
    else {
        if (success) {
            global_1.log.warn("ack dropped for for user: " + userName + " with id: " + messageId);
        }
        else {
            global_1.log.warn("both ack and message delivery failed for user: " + userName + " with id: " + messageId);
        }
    }
};
var getGroupMembers = function (group, callback) {
    global_1.redisClient.lrange(group, 0, -1, function (err, users) {
        if (err) {
            global_1.log.error(err.message);
            callback(null);
            return;
        }
        callback(users);
    });
};
var sendMessageSingleUser = function (receiver, message, callback) {
    if (messengerState.isUserActive(receiver)) {
        var socketId = messengerState.getSocket(receiver);
        if (!socketId) {
            callback(false);
            return;
        }
        global_1.io.to(socketId).emit(constants_1.RECV_MESSAGE, JSON.stringify(message));
        callback(true);
    }
    else {
        enQueueMessage(receiver, message, callback);
    }
};
var sendMessage = function (userName, sessionKey, message, callback) {
    if (userName !== message.sender) {
        callback(false);
        return;
    }
    auth_1.default.validateSession(userName, sessionKey, function (success) {
        if (success) {
            if (message.receiver.startsWith(constants_1.GROUP_PREFIX)) {
                getGroupMembers(message.receiver, function (users) {
                    if (users && users.includes(userName)) {
                        users.forEach(function (receiver) {
                            if (receiver !== userName) {
                                sendMessageSingleUser(receiver, message, function () {
                                    return;
                                });
                            }
                        });
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            else {
                sendMessageSingleUser(message.receiver, message, callback);
            }
        }
        else {
            callback(false);
        }
    });
};
var messenger = {
    pendingMessages: pendingMessages,
    sendMessage: sendMessage,
    sendAck: sendAck,
    addClient: addClient,
    removeClient: removeClient,
    getClient: getClient,
};
exports.default = messenger;
