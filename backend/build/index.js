"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var global_1 = require("./global");
var constants_1 = require("./constants");
var key = fs_1.default.readFileSync(constants_1.SSL_KEY_PATH);
var cert = fs_1.default.readFileSync(constants_1.SSL_CERT_PATH);
var options = {
    key: key,
    cert: cert,
};
var app = express_1.default();
app.get("/", function (req, res) {
    res.send("Hello World");
});
var server = https_1.default.createServer(options, app);
server.listen(constants_1.SERVER_PORT, function () {
    global_1.log.info("Example app listening at https://localhost:" + constants_1.SERVER_PORT);
});
