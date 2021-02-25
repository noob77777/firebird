import express from "express";
import http from "http";
import https from "https";
import fs from "fs";
import { log } from "./global";
import {
  SERVER_PORT_HTTP,
  SERVER_PORT_HTTPS,
  SSL_CERT_PATH,
  SSL_KEY_PATH,
  USER_PREFIX,
} from "./constants";

import auth from "./auth/auth";

const key = fs.readFileSync(SSL_KEY_PATH);
const cert = fs.readFileSync(SSL_CERT_PATH);
const options = {
  key,
  cert,
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!!!");
});

app.post("/api/createUser", (req, res) => {
  const userName = USER_PREFIX + "." + req.body.userName;
  const hash = req.body.hash;
  const publicKey = req.body.publicKey;
  auth.createUser(userName, hash, publicKey, (success) => {
    if (success) {
      res.status(200);
      res.json({ message: "OK" });
    } else {
      res.status(401);
      res.json({ message: "Permission Denied" });
    }
  });
});

app.post("/api/validateUser", (req, res) => {
  const userName = USER_PREFIX + "." + req.body.userName;
  const hash = req.body.hash;
  auth.validateUser(userName, hash, (sessionKey) => {
    if (sessionKey) {
      res.status(200);
      res.json({ message: "OK", sessionKey });
    } else {
      res.status(401);
      res.json({ message: "Permission Denied" });
    }
  });
});

app.post("/api/getPublicKey", (req, res) => {
  const userName = USER_PREFIX + "." + req.body.userName;
  const sessionKey = req.body.sessionKey;
  const user = USER_PREFIX + "." + req.body.user;
  auth.getPublicKey(userName, sessionKey, user, (publicKey) => {
    if (publicKey) {
      res.status(200);
      res.json({ message: "OK", publicKey });
    } else {
      res.status(401);
      res.json({ message: "Permission Denied" });
    }
  });
});

const serverHTTP = http.createServer(app);
const serverHTTPS = https.createServer(options, app);
serverHTTP.listen(SERVER_PORT_HTTP, () => {
  log.info(`Example app listening at http://localhost:${SERVER_PORT_HTTP}`);
});
serverHTTPS.listen(SERVER_PORT_HTTPS, () => {
  log.info(`Example app listening at https://localhost:${SERVER_PORT_HTTPS}`);
});
