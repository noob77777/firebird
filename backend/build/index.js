"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var global_1 = require("./global");
var constants_1 = require("./constants");
var auth_1 = __importDefault(require("./auth/auth"));
var key = fs_1.default.readFileSync(constants_1.SSL_KEY_PATH);
var cert = fs_1.default.readFileSync(constants_1.SSL_CERT_PATH);
var options = {
    key: key,
    cert: cert,
};
var app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", function (req, res) {
    res.send("Hello!!!");
});
app.post("/api/createUser", function (req, res) {
    var userName = constants_1.USER_PREFIX + "." + req.body.userName;
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
app.post("/api/validateUser", function (req, res) {
    var userName = constants_1.USER_PREFIX + "." + req.body.userName;
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
app.post("/api/getPublicKey", function (req, res) {
    var userName = constants_1.USER_PREFIX + "." + req.body.userName;
    var sessionKey = req.body.sessionKey;
    var user = constants_1.USER_PREFIX + "." + req.body.user;
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
var serverHTTP = http_1.default.createServer(app);
var serverHTTPS = https_1.default.createServer(options, app);
serverHTTP.listen(constants_1.SERVER_PORT_HTTP, function () {
    global_1.log.info("Example app listening at http://localhost:" + constants_1.SERVER_PORT_HTTP);
});
serverHTTPS.listen(constants_1.SERVER_PORT_HTTPS, function () {
    global_1.log.info("Example app listening at https://localhost:" + constants_1.SERVER_PORT_HTTPS);
});
