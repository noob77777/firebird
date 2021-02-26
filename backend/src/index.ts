import express from "express";
import {
  log,
  app,
  serverHTTP,
  serverHTTPS,
  io,
  isUser,
  isMessage,
} from "./global";
import {
  NEW_CONNECTION,
  SEND_MESSAGE,
  SERVER_PORT_HTTP,
  SERVER_PORT_HTTPS,
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
  const userName = req.body.userName;
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
  const userName = req.body.userName;
  const sessionKey = req.body.sessionKey;
  const user = req.body.user;
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

io.attach(serverHTTP);
io.attach(serverHTTPS);

io.on("connection", (client) => {
  client.on(NEW_CONNECTION, (user: any) => {
    user = JSON.parse(user);
    if ("userName" in user && "sessionKey" in user) {
      messenger.addClient(user.userName, user.sessionKey, client.id);
    }
  });
  client.on("disconnect", () => {
    messenger.removeClient(client.id);
  });
  client.on(SEND_MESSAGE, (data: any) => {
    data = JSON.parse(data);
    if (
      "userName" in data &&
      "sessionKey" in data &&
      "message" in data &&
      isMessage(data.message)
    ) {
      messenger.sendMessage(
        data.userName,
        data.sessionKey,
        data.message,
        (success) => {
          return;
        }
      );
    }
  });
});

serverHTTP.listen(SERVER_PORT_HTTP, () => {
  log.info(`Example app listening at http://localhost:${SERVER_PORT_HTTP}`);
});
serverHTTPS.listen(SERVER_PORT_HTTPS, () => {
  log.info(`Example app listening at https://localhost:${SERVER_PORT_HTTPS}`);
});
