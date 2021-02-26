import express from "express";
import { log, app, serverHTTP, serverHTTPS, io, isMessage } from "./global";
import {
  NEW_CONNECTION,
  SEND_MESSAGE,
  SERVER_PORT_HTTP,
  SERVER_PORT_HTTPS,
  USER_PREFIX,
} from "./constants";
import auth from "./auth/auth";
import messenger from "./messenger/messenger";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!!!");
});

app.post("/api/createUser", (req, res) => {
  const userName = req.body.userName;
  const hash = req.body.hash;
  const publicKey = req.body.publicKey;
  if (
    typeof userName === "string" &&
    typeof hash === "string" &&
    typeof publicKey === "string" &&
    userName.startsWith(USER_PREFIX + ".")
  ) {
    auth.createUser(userName, hash, publicKey, (success) => {
      if (success) {
        res.status(200);
        res.json({ message: "OK" });
      } else {
        res.status(401);
        res.json({ message: "Permission Denied" });
      }
    });
  } else {
    res.status(400);
    res.json({ message: "Invalid Arguments" });
  }
});

app.post("/api/validateUser", (req, res) => {
  const userName = req.body.userName;
  const hash = req.body.hash;
  if (typeof userName === "string" && typeof hash === "string") {
    auth.validateUser(userName, hash, (sessionKey) => {
      if (sessionKey) {
        res.status(200);
        res.json({ message: "OK", sessionKey });
      } else {
        res.status(401);
        res.json({ message: "Permission Denied" });
      }
    });
  } else {
    res.status(400);
    res.json({ message: "Invalid Arguments" });
  }
});

app.post("/api/getPublicKey", (req, res) => {
  const userName = req.body.userName;
  const sessionKey = req.body.sessionKey;
  const user = req.body.user;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof user === "string"
  ) {
    auth.getPublicKey(userName, sessionKey, user, (publicKey) => {
      if (publicKey) {
        res.status(200);
        res.json({ message: "OK", publicKey });
      } else {
        res.status(401);
        res.json({ message: "Permission Denied" });
      }
    });
  } else {
    res.status(400);
    res.json({ message: "Invalid Arguments" });
  }
});

app.post("/api/getPendingMessages", (req, res) => {
  const userName = req.body.userName;
  const sessionKey = req.body.sessionKey;
  if (typeof userName === "string" && typeof sessionKey === "string") {
    messenger.pendingMessages(userName, sessionKey, (messageList) => {
      if (messageList) {
        res.status(200);
        res.json({ message: "OK", messageList });
      } else {
        res.status(401);
        res.json({ message: "Permission Denied" });
      }
    });
  } else {
    res.status(400);
    res.json({ message: "Invalid Arguments" });
  }
});

io.attach(serverHTTP);
io.attach(serverHTTPS);

io.on("connection", (client) => {
  client.on(NEW_CONNECTION, (data: any) => {
    data = JSON.parse(data);
    if (
      data &&
      typeof data.userName === "string" &&
      typeof data.sessionKey === "string"
    ) {
      messenger.addClient(data.userName, data.sessionKey, client.id);
    }
  });

  client.on("disconnect", () => {
    messenger.removeClient(client.id);
  });

  client.on(SEND_MESSAGE, (data: any) => {
    data = JSON.parse(data);
    if (
      data &&
      typeof data.userName === "string" &&
      typeof data.sessionKey === "string" &&
      isMessage(data.message)
    ) {
      messenger.sendMessage(
        data.userName,
        data.sessionKey,
        data.message,
        (success) => {
          messenger.sendAck(data.userName, data.message.id, success);
        }
      );
    }
  });
});

serverHTTP.listen(SERVER_PORT_HTTP, () => {
  log.info(`firebird listening at http://localhost:${SERVER_PORT_HTTP}`);
});
serverHTTPS.listen(SERVER_PORT_HTTPS, () => {
  log.info(`firebird listening at https://localhost:${SERVER_PORT_HTTPS}`);
});
