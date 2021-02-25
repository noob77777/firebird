"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var global_1 = require("../global");
var crypto_1 = __importDefault(require("crypto"));
function isUser(o) {
    return "userName" in o && "hash" in o && "publicKey" in o;
}
var createUser = function (userName, hash, publicKey, callback) {
    var user = {
        userName: userName,
        hash: hash,
        publicKey: publicKey,
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
var validateUser = function (userName, hash, callback) {
    global_1.redisClient.get(userName, function (errGet, result) {
        if (errGet) {
            global_1.log.error(errGet.message);
            callback(null);
            return;
        }
        if (result) {
            var user_1 = JSON.parse(result);
            if (isUser(user_1) && user_1.hash === hash) {
                user_1.sessionKey = generateSessionKey(user_1.userName);
                global_1.redisClient.set(user_1.userName, JSON.stringify(user_1), function (errSet) {
                    if (errSet) {
                        global_1.log.error(errSet.message);
                        callback(null);
                        return;
                    }
                    callback(user_1.sessionKey ? user_1.sessionKey : null);
                });
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
var validateSession = function (userName, sessionKey, callback) {
    global_1.redisClient.get(userName, function (err, result) {
        if (err) {
            global_1.log.error(err.message);
            callback(false);
            return;
        }
        if (result) {
            var user = JSON.parse(result);
            if (isUser(user) && user.sessionKey === sessionKey) {
                callback(true);
                return;
            }
        }
        callback(false);
    });
};
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
                    if (isUser(u) && u.publicKey) {
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
var generateSessionKey = function (userName) {
    var key = userName + "." + Date.now().toString();
    return crypto_1.default.createHash("sha256").update(key).digest("hex");
};
var auth = {
    createUser: createUser,
    validateUser: validateUser,
    validateSession: validateSession,
    getPublicKey: getPublicKey,
};
exports.default = auth;
