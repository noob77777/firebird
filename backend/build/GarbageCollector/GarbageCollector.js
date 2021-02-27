"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var global_1 = require("../global");
var GarbageCollector = /** @class */ (function () {
    function GarbageCollector() {
        var _this = this;
        this.runGarbageCollector = function () {
            global_1.log.info("garbage collection started");
            global_1.redisClient.lrange(constants_1.BROADCAST_GROUP, 0, -1, function (errLRangeUsers, users) {
                if (errLRangeUsers) {
                    global_1.log.error(errLRangeUsers.message);
                    return;
                }
                users.forEach(function (user) {
                    var queueName = user + constants_1.QUEUE_SUFFIX;
                    global_1.redisClient.watch(queueName, function (errWatch) {
                        if (errWatch) {
                            global_1.log.error(errWatch.message);
                            return;
                        }
                        global_1.redisClient.lrange(queueName, 0, -1, function (errLRangeQueue, result) {
                            if (errLRangeQueue) {
                                global_1.log.error(errLRangeQueue.message);
                                return;
                            }
                            var timestamp = Date.now();
                            var messages = result
                                .map(function (message) { return JSON.parse(message); })
                                .filter(global_1.isMessage)
                                .filter(function (message) {
                                return message.timestamp + constants_1.GARBAGE_COLLECTOR_MAX_AGE >= timestamp;
                            })
                                .map(function (message) { return JSON.stringify(message); });
                            if (messages.length === result.length) {
                                return;
                            }
                            if (messages.length !== 0) {
                                global_1.redisClient
                                    .multi()
                                    .ltrim(queueName, result.length, -1)
                                    .rpush(queueName, messages)
                                    .exec(function (errExec) {
                                    if (errExec) {
                                        global_1.log.error(errExec.message);
                                        return;
                                    }
                                    global_1.log.info("garbage collection completed for queue: " + queueName + " removed: " + (result.length - messages.length) + " old messages");
                                });
                            }
                            else {
                                global_1.redisClient
                                    .multi()
                                    .ltrim(queueName, result.length, -1)
                                    .exec(function (errExec) {
                                    if (errExec) {
                                        global_1.log.error(errExec.message);
                                        return;
                                    }
                                    global_1.log.info("garbage collection completed for queue: " + queueName + " removed: " + (result.length - messages.length) + " old messages");
                                });
                            }
                        });
                    });
                });
            });
        };
        this.start = function () {
            setInterval(_this.runGarbageCollector, constants_1.GARBAGE_COLLECTOR_RUN_INTERVAL);
        };
    }
    return GarbageCollector;
}());
var garbageCollector = new GarbageCollector();
exports.default = garbageCollector;
