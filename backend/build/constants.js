"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GARBAGE_COLLECTOR_MAX_AGE = exports.GARBAGE_COLLECTOR_RUN_INTERVAL = exports.SESSION_AUTO_TIMEOUT = exports.TYPE_IMAGE = exports.TYPE_ACK = exports.TYPE_TEXT = exports.USER_STATE_CHANGE = exports.ACK_MESSAGE = exports.RECV_MESSAGE = exports.SEND_MESSAGE = exports.NEW_CONNECTION = exports.QUEUE_SUFFIX = exports.USER_SERVER = exports.BROADCAST_GROUP = exports.GROUP_PREFIX = exports.USER_PREFIX = exports.SSL_KEY_PATH = exports.SSL_CERT_PATH = exports.LOG_FILE_PATH = exports.REDIS_PORT = exports.REDIS_HOST = exports.SERVER_PORT_HTTPS = exports.SERVER_PORT_HTTP = void 0;
exports.SERVER_PORT_HTTP = 8080;
exports.SERVER_PORT_HTTPS = 8443;
exports.REDIS_HOST = "127.0.0.1";
exports.REDIS_PORT = 6379;
exports.LOG_FILE_PATH = "firebird_backend.log";
exports.SSL_CERT_PATH = "./certs/firebird.crt";
exports.SSL_KEY_PATH = "./certs/firebird.key";
exports.USER_PREFIX = "user.";
exports.GROUP_PREFIX = "group.";
exports.BROADCAST_GROUP = "group.broadcast";
exports.USER_SERVER = "user.firebird";
exports.QUEUE_SUFFIX = ".queue";
exports.NEW_CONNECTION = "new_connection";
exports.SEND_MESSAGE = "send_message";
exports.RECV_MESSAGE = "recv_message";
exports.ACK_MESSAGE = "ack_message";
exports.USER_STATE_CHANGE = "user_state_change";
exports.TYPE_TEXT = "text";
exports.TYPE_ACK = "ack";
exports.TYPE_IMAGE = "image";
exports.SESSION_AUTO_TIMEOUT = 60 * 60 * 1000; // 1 Hr
exports.GARBAGE_COLLECTOR_RUN_INTERVAL = 23 * 60 * 60 * 1000; // 23 Hrs
exports.GARBAGE_COLLECTOR_MAX_AGE = 24 * 60 * 60 * 1000; // 24 Hrs
