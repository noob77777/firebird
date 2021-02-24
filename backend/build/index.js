"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var simple_node_logger_1 = __importDefault(require("simple-node-logger"));
var constants_1 = require("./constants");
var app = express_1.default();
var log = simple_node_logger_1.default.createSimpleFileLogger(constants_1.LOG_FILE);
app.get("/", function (req, res) {
    res.send("Hello World");
});
app.listen(constants_1.SERVER_PORT, function () {
    log.info("Example app listening at http://localhost:" + constants_1.SERVER_PORT);
});
