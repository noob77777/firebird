"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
var constants_1 = require("../constants");
var crypto_1 = __importDefault(require("crypto"));
var SessionStore = /** @class */ (function () {
    function SessionStore() {
        var _this = this;
        this.sessions = {};
        this.addSession = function (userName, sessionKey) {
            _this.sessions[userName] = sessionKey;
        };
        this.getSession = function (userName) {
            return _this.sessions[userName];
        };
    }
    return SessionStore;
}());
var sessionStore = new SessionStore();
/**
 * [secure] [redis] [atomic]
 * @param userName
 * @param hash
 * @param publicKey
 * @param callback
 */
var createUser = function (userName, hash, publicKey, callback) {
    var user = {
        userName: userName,
        hash: hash,
        publicKey: publicKey,
        contacts: [],
    };
    global_1.redisClient.watch(userName, function (errWatch) {
        if (errWatch) {
            global_1.log.error(errWatch.message);
            callback(false);
            return;
        }
        global_1.redisClient.get(userName, function (errGet, result) {
            if (errGet) {
                global_1.log.error(errGet.message);
                callback(false);
                return;
            }
            if (!result) {
                global_1.redisClient
                    .multi()
                    .set(userName, JSON.stringify(user))
                    .rpush(constants_1.BROADCAST_GROUP, userName)
                    .exec(function (errExec) {
                    if (errExec) {
                        global_1.log.error(errExec.message);
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
    });
};
/**
 * [secure] [redis]
 * @param userName
 * @param hash
 * @param callback
 */
var validateUser = function (userName, hash, callback) {
    global_1.redisClient.get(userName, function (err, result) {
        if (err) {
            global_1.log.error(err.message);
            callback(null);
            return;
        }
        if (result) {
            var user = JSON.parse(result);
            if (global_1.isUser(user) && user.hash === hash) {
                var sessionKey = generateSessionKey(userName);
                sessionStore.addSession(userName, sessionKey);
                callback(sessionKey);
            }
            else {
                callback(null);
            }
        }
        else {
            callback(null);
        }
    });
};
/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param callback
 */
var validateSession = function (userName, sessionKey, callback) {
    if (sessionStore.getSession(userName) === sessionKey) {
        callback(true);
    }
    else {
        callback(false);
    }
};
/**
 * [secure] [redis]
 * @param userName
 * @param sessionKey
 * @param user
 * @param callback
 */
var getPublicKey = function (userName, sessionKey, user, callback) {
    validateSession(userName, sessionKey, function (success) {
        if (success) {
            global_1.redisClient.get(user, function (err, result) {
                if (err) {
                    global_1.log.error(err.message);
                    callback(null);
                    return;
                }
                if (result) {
                    var u = JSON.parse(result);
                    if (global_1.isUser(u) && u.publicKey) {
                        callback(u.publicKey);
                        return;
                    }
                }
                callback(null);
            });
        }
        else {
            callback(null);
        }
    });
};
/**
 * @param userName
 * @param callback
 */
var userExists = function (userName, callback) {
    global_1.redisClient.get(userName, function (err, result) {
        if (err) {
            global_1.log.error(err.message);
            callback(false);
            return;
        }
        if (!result) {
            callback(false);
            return;
        }
        var u = JSON.parse(result);
        if (u && global_1.isUser(u)) {
            callback(true);
            return;
        }
        callback(false);
    });
};
var generateSessionKey = function (userName) {
    var key = userName + "." + Date.now().toString();
    return crypto_1.default.createHash("sha256").update(key).digest("hex");
};
/**
 * [secure] [redis] [atomic]
 * @param userName
 * @param sessionKey
 * @param groupName
 * @param callback
 */
var createGroup = function (userName, sessionKey, groupName, callback) {
    validateSession(userName, sessionKey, function (success) {
        if (success) {
            global_1.redisClient.watch(groupName, function (errWatch) {
                if (errWatch) {
                    global_1.log.error(errWatch.message);
                    callback(false);
                    return;
                }
                global_1.redisClient.lrange(groupName, 0, -1, function (errLRange, result) {
                    if (errLRange) {
                        global_1.log.error(errLRange.message);
                        callback(false);
                        return;
                    }
                    if (result.length === 0) {
                        global_1.redisClient
                            .multi()
                            .rpush(groupName, userName)
                            .exec(function (errExec) {
                            if (errExec) {
                                global_1.log.error(errExec.message);
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
            });
        }
        else {
            callback(false);
        }
    });
};
/**
 * [secure] [redis]
 * @param userName
 * @param sessionKey
 * @param group
 * @param callback
 */
var getGroupMembers = function (userName, sessionKey, group, callback) {
    validateSession(userName, sessionKey, function (success) {
        if (success) {
            global_1.redisClient.lrange(group, 0, -1, function (err, users) {
                if (err) {
                    global_1.log.error(err.message);
                    callback(null);
                    return;
                }
                if (users.includes(userName)) {
                    callback(users);
                }
                else {
                    callback(null);
                }
            });
        }
        else {
            callback(null);
        }
    });
};
/**
 * [sucure] [redis]
 * @param userName
 * @param sessionKey
 * @param group
 * @param callback
 */
var joinGroup = function (userName, sessionKey, group, callback) {
    validateSession(userName, sessionKey, function (success) {
        if (success) {
            global_1.redisClient.lrange(group, 0, -1, function (errLrange, result) {
                if (errLrange) {
                    global_1.log.error(errLrange.message);
                    callback(false);
                    return;
                }
                if (result.length !== 0 && !result.includes(userName)) {
                    global_1.redisClient.rpush(group, userName, function (errRPush) {
                        if (errRPush) {
                            global_1.log.error(errRPush.message);
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
        }
        else {
            callback(false);
        }
    });
};
var auth = {
    createUser: createUser,
    validateUser: validateUser,
    validateSession: validateSession,
    getPublicKey: getPublicKey,
    userExists: userExists,
    createGroup: createGroup,
    getGroupMembers: getGroupMembers,
    joinGroup: joinGroup,
};
exports.default = auth;
