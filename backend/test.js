const axios = require("axios");
const crypto = require("crypto");
const io = require("socket.io-client");
const socket = io("http://localhost:8080");

socket.on("recv_message", (data) => {
  console.log("recv_message: " + data);
});

socket.on("ack_message", (data) => {
  console.log("ack_message: " + data);
});

socket.on("user_state_change", (data) => {
  console.log("user_state_change: " + data);
});

const u1 = { userName: "user.u1", hash: "hash", publicKey: "key" };
const u2 = { userName: "user.u2", hash: "hash", publicKey: "key" };
const u_failed = { userName: "u1", hash: "hash", publicKey: "key" };

const testCreateUser = (u) => {
  axios.post("http://localhost:8080/api/createUser", u).then((res) => {
    console.log(res.data);
  });
};

const testValidateUser = (u) => {
  axios.post("http://localhost:8080/api/validateUser", u).then((res) => {
    console.log(res.data);
  });
};

const testGetPublicKey = (userName, key) => {
  axios
    .get(
      `http://localhost:8080/api/publicKey?userName=${userName}&sessionKey=${key}&user=user.u2`
    )
    .then((res) => {
      console.log(res.data);
    });
};

const testGetPendingMessages = (userName, key) => {
  axios
    .get(
      `http://localhost:8080/api/pendingMessages?userName=${userName}&sessionKey=${key}`
    )
    .then((res) => {
      console.log(res.data);
    });
};

const testCreateGroup = (userName, key) => {
  axios
    .post("http://localhost:8080/api/createGroup", {
      userName: userName,
      sessionKey: key,
      groupName: "group.testgroup2",
    })
    .then((res) => {
      console.log(res.data);
    });
};

const testJoinGroup = (userName, key) => {
  axios
    .post("http://localhost:8080/api/joinGroup", {
      userName: userName,
      sessionKey: key,
      groupName: "group.testgroup",
    })
    .then((res) => {
      console.log(res.data);
    });
};

const testGetGroupMembers = (userName, key) => {
  axios
    .get(
      `http://localhost:8080/api/groupMembers?userName=${userName}&sessionKey=${key}&groupName=group.broadcast`
    )
    .then((res) => {
      console.log(res.data);
    });
};

const testSocketConnect = (userName, key) => {
  socket.emit(
    "new_connection",
    JSON.stringify({ userName: userName, sessionKey: key })
  );
  const timestamp = Date.now();
  const message = {
    timestamp: timestamp,
    id: crypto
      .createHash("sha256")
      .update(timestamp + "." + userName)
      .digest("hex"),
    type: "text",
    sender: userName,
    receiver: "user.user7",
    body: "Hello",
  };
  console.log("send_message: " + JSON.stringify(message));
  socket.emit(
    "send_message",
    JSON.stringify({ userName: userName, sessionKey: key, message: message })
  );
};

const testAutoTimeOut = (userName, key) => {
  setTimeout(() => testGetPublicKey(userName, key), 1000);
  setTimeout(() => testGetPublicKey(userName, key), 3000);
  setTimeout(() => testGetPublicKey(userName, key), 10000);
};

const runTest = (userName, hash, test) => {
  const u = { userName, hash };
  axios.post("http://localhost:8080/api/validateUser", u).then((res) => {
    test(u.userName, res.data.sessionKey);
  });
};

// runTest("user.u1", "hash", testGetPublicKey);
// runTest("user.u1", "hash", testGetPendingMessages);
// runTest("user.u2", "hash", testGetPendingMessages);
// runTest("user.u2", "hash", testSocketConnect);
runTest("user.u1", "hash", testSocketConnect);
// runTest("user.u1", "hash", testCreateGroup);
// runTest("user.u2", "hash", testJoinGroup);
// runTest("user.u1", "hash", testGetGroupMembers);
// runTest("user.u1", "hash", testAutoTimeOut);
