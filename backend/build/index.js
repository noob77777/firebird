"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var global_1 = require("./global");
var constants_1 = require("./constants");
var auth_1 = __importDefault(require("./auth/auth"));
var messenger_1 = __importDefault(require("./messenger/messenger"));
var GarbageCollector_1 = __importDefault(require("./GarbageCollector/GarbageCollector"));
global_1.app.use(express_1.default.urlencoded({ extended: true }));
global_1.app.use(express_1.default.json());
global_1.app.get("/", function (req, res) {
    var userAgent = req.headers["user-agent"];
    if (userAgent) {
        res.send("WELCOME TO FIREBIRD API: " + userAgent);
    }
    else {
        res.send("WELCOME TO FIREBIRD API");
    }
});
global_1.app.post("/api/createUser", function (req, res) {
    var userName = req.body.userName;
    var hash = req.body.hash;
    var publicKey = req.body.publicKey;
    if (typeof userName === "string" &&
        typeof hash === "string" &&
        typeof publicKey === "string" &&
        userName.startsWith(constants_1.USER_PREFIX)) {
        auth_1.default.createUser(userName, hash, publicKey, function (success) {
            if (success) {
                res.status(200);
                res.json({ message: "OK", userName: userName });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.post("/api/validateUser", function (req, res) {
    var userName = req.body.userName;
    var hash = req.body.hash;
    if (typeof userName === "string" && typeof hash === "string") {
        auth_1.default.validateUser(userName, hash, function (sessionKey) {
            if (sessionKey) {
                res.status(200);
                res.json({ message: "OK", userName: userName, sessionKey: sessionKey });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.get("/api/publicKey", function (req, res) {
    var userName = req.query.userName;
    var sessionKey = req.query.sessionKey;
    var user = req.query.user;
    if (typeof userName === "string" &&
        typeof sessionKey === "string" &&
        typeof user === "string") {
        auth_1.default.getPublicKey(userName, sessionKey, user, function (publicKey) {
            if (publicKey) {
                res.status(200);
                res.json({ message: "OK", userName: user, publicKey: publicKey });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.get("/api/pendingMessages", function (req, res) {
    var userName = req.query.userName;
    var sessionKey = req.query.sessionKey;
    if (typeof userName === "string" && typeof sessionKey === "string") {
        messenger_1.default.pendingMessages(userName, sessionKey, function (messageList) {
            if (messageList) {
                res.status(200);
                res.json({ message: "OK", messageList: messageList });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.post("/api/createGroup", function (req, res) {
    var userName = req.body.userName;
    var sessionKey = req.body.sessionKey;
    var groupName = req.body.groupName;
    if (typeof userName === "string" &&
        typeof sessionKey === "string" &&
        typeof groupName === "string" &&
        groupName.startsWith(constants_1.GROUP_PREFIX)) {
        auth_1.default.createGroup(userName, sessionKey, groupName, function (success) {
            if (success) {
                res.status(200);
                res.json({ message: "OK", groupName: groupName });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.get("/api/groupMembers", function (req, res) {
    var userName = req.query.userName;
    var sessionKey = req.query.sessionKey;
    var groupName = req.query.groupName;
    if (typeof userName === "string" &&
        typeof sessionKey === "string" &&
        typeof groupName === "string") {
        auth_1.default.getGroupMembers(userName, sessionKey, groupName, function (users) {
            if (users) {
                res.status(200);
                res.json({ message: "OK", groupName: groupName, groupMembers: users });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.app.post("/api/joinGroup", function (req, res) {
    var userName = req.body.userName;
    var sessionKey = req.body.sessionKey;
    var groupName = req.body.groupName;
    if (typeof userName === "string" &&
        typeof sessionKey === "string" &&
        typeof groupName === "string") {
        auth_1.default.joinGroup(userName, sessionKey, groupName, function (success) {
            if (success) {
                res.status(200);
                res.json({ message: "OK", groupName: groupName });
            }
            else {
                res.status(401);
                res.json({ message: "Permission Denied" });
            }
        });
    }
    else {
        res.status(400);
        res.json({ message: "Invalid Arguments" });
    }
});
global_1.io.attach(global_1.serverHTTP);
global_1.io.attach(global_1.serverHTTPS);
global_1.io.on("connection", function (client) {
    client.on(constants_1.NEW_CONNECTION, function (data) {
        data = JSON.parse(data);
        if (data &&
            typeof data.userName === "string" &&
            typeof data.sessionKey === "string") {
            messenger_1.default.addClient(data.userName, data.sessionKey, client.id);
        }
    });
    client.on("disconnect", function () {
        var userName = messenger_1.default.getClient(client.id);
        messenger_1.default.removeClient(client.id);
        if (userName) {
            auth_1.default.removeSession(userName);
        }
    });
    client.on(constants_1.SEND_MESSAGE, function (data) {
        data = JSON.parse(data);
        if (data &&
            typeof data.userName === "string" &&
            typeof data.sessionKey === "string" &&
            global_1.isMessage(data.message)) {
            messenger_1.default.sendMessage(data.userName, data.sessionKey, data.message, function (success) {
                messenger_1.default.sendAck(data.userName, data.message.id, success);
            });
        }
    });
});
global_1.serverHTTP.listen(constants_1.SERVER_PORT_HTTP, function () {
    global_1.log.info("firebird listening at http://localhost:" + constants_1.SERVER_PORT_HTTP);
});
global_1.serverHTTPS.listen(constants_1.SERVER_PORT_HTTPS, function () {
    global_1.log.info("firebird listening at https://localhost:" + constants_1.SERVER_PORT_HTTPS);
});
GarbageCollector_1.default.start();
