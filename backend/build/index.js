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
global_1.app.use(express_1.default.urlencoded({ extended: true }));
global_1.app.use(express_1.default.json());
global_1.app.get("/", function (req, res) {
    res.send("Hello!!!");
});
global_1.app.post("/api/createUser", function (req, res) {
    var userName = req.body.userName;
    var hash = req.body.hash;
    var publicKey = req.body.publicKey;
    auth_1.default.createUser(userName, hash, publicKey, function (success) {
        if (success) {
            res.status(200);
            res.json({ message: "OK" });
        }
        else {
            res.status(401);
            res.json({ message: "Permission Denied" });
        }
    });
});
global_1.app.post("/api/validateUser", function (req, res) {
    var userName = req.body.userName;
    var hash = req.body.hash;
    auth_1.default.validateUser(userName, hash, function (sessionKey) {
        if (sessionKey) {
            res.status(200);
            res.json({ message: "OK", sessionKey: sessionKey });
        }
        else {
            res.status(401);
            res.json({ message: "Permission Denied" });
        }
    });
});
global_1.app.post("/api/getPublicKey", function (req, res) {
    var userName = req.body.userName;
    var sessionKey = req.body.sessionKey;
    var user = req.body.user;
    auth_1.default.getPublicKey(userName, sessionKey, user, function (publicKey) {
        if (publicKey) {
            res.status(200);
            res.json({ message: "OK", publicKey: publicKey });
        }
        else {
            res.status(401);
            res.json({ message: "Permission Denied" });
        }
    });
});
global_1.io.attach(global_1.serverHTTP);
global_1.io.attach(global_1.serverHTTPS);
global_1.io.on("connection", function (client) {
    client.on(constants_1.NEW_CONNECTION, function (user) {
        user = JSON.parse(user);
        if ("userName" in user && "sessionKey" in user) {
            messenger_1.default.addClient(user.userName, user.sessionKey, client.id);
        }
    });
    client.on("disconnect", function () {
        messenger_1.default.removeClient(client.id);
    });
    client.on(constants_1.SEND_MESSAGE, function (data) {
        data = JSON.parse(data);
        if ("userName" in data &&
            "sessionKey" in data &&
            "message" in data &&
            global_1.isMessage(data.message)) {
            messenger_1.default.sendMessage(data.userName, data.sessionKey, data.message, function (success) {
                return;
            });
        }
    });
});
global_1.serverHTTP.listen(constants_1.SERVER_PORT_HTTP, function () {
    global_1.log.info("Example app listening at http://localhost:" + constants_1.SERVER_PORT_HTTP);
});
global_1.serverHTTPS.listen(constants_1.SERVER_PORT_HTTPS, function () {
    global_1.log.info("Example app listening at https://localhost:" + constants_1.SERVER_PORT_HTTPS);
});
