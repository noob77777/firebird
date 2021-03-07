import express from "express";
import cors from "cors";
import { log, app, serverHTTP, serverHTTPS, io, isMessage } from "./global";
import {
  GROUP_PREFIX,
  NEW_CONNECTION,
  SEND_MESSAGE,
  SERVER_PORT_HTTP,
  SERVER_PORT_HTTPS,
  USER_PREFIX,
} from "./constants";
import auth from "./auth/auth";
import messenger from "./messenger/messenger";
import GarbageCollector from "./GarbageCollector/GarbageCollector";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  const userAgent = req.headers["user-agent"];
  if (userAgent) {
    res.send(`WELCOME TO FIREBIRD API: ${userAgent}`);
  } else {
    res.send(`WELCOME TO FIREBIRD API`);
  }
});

app.post("/api/createUser", (req, res) => {
  const userName = req.body.userName;
  const hash = req.body.hash;
  const publicKey = req.body.publicKey;
  if (
    typeof userName === "string" &&
    typeof hash === "string" &&
    typeof publicKey === "string" &&
    userName.startsWith(USER_PREFIX)
  ) {
    auth.createUser(userName, hash, publicKey, (success) => {
      if (success) {
        res.status(200);
        res.json({ message: "OK", userName });
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
        res.json({ message: "OK", userName, sessionKey });
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

app.get("/api/publicKey", (req, res) => {
  const userName = req.query.userName;
  const sessionKey = req.query.sessionKey;
  const user = req.query.user;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof user === "string"
  ) {
    auth.getPublicKey(userName, sessionKey, user, (publicKey) => {
      if (publicKey) {
        res.status(200);
        res.json({ message: "OK", userName: user, publicKey });
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

app.get("/api/pendingMessages", (req, res) => {
  const userName = req.query.userName;
  const sessionKey = req.query.sessionKey;
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

app.post("/api/createGroup", (req, res) => {
  const userName = req.body.userName;
  const sessionKey = req.body.sessionKey;
  const groupName = req.body.groupName;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof groupName === "string" &&
    groupName.startsWith(GROUP_PREFIX)
  ) {
    auth.createGroup(userName, sessionKey, groupName, (success) => {
      if (success) {
        res.status(200);
        res.json({ message: "OK", groupName });
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

app.get("/api/groupMembers", (req, res) => {
  const userName = req.query.userName;
  const sessionKey = req.query.sessionKey;
  const groupName = req.query.groupName;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof groupName === "string"
  ) {
    auth.getGroupMembers(userName, sessionKey, groupName, (users) => {
      if (users) {
        res.status(200);
        res.json({ message: "OK", groupName, groupMembers: users });
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

app.post("/api/joinGroup", (req, res) => {
  const userName = req.body.userName;
  const sessionKey = req.body.sessionKey;
  const groupName = req.body.groupName;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof groupName === "string"
  ) {
    auth.joinGroup(userName, sessionKey, groupName, (success) => {
      if (success) {
        res.status(200);
        res.json({ message: "OK", groupName });
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

app.get("/api/userActive", (req, res) => {
  const userName = req.query.userName;
  const sessionKey = req.query.sessionKey;
  const user = req.query.user;
  if (
    typeof userName === "string" &&
    typeof sessionKey === "string" &&
    typeof user === "string"
  ) {
    messenger.getUserActive(userName, sessionKey, user, (active) => {
      if (active !== null) {
        res.status(200);
        res.json({ message: "OK", user, active });
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

const corsSocketOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
};
io.attach(serverHTTP, { cors: corsSocketOptions });
io.attach(serverHTTPS, { cors: corsSocketOptions });

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

GarbageCollector.start();
