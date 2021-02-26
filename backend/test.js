const axios = require("axios");
const io = require("socket.io-client");
const socket = io("http://localhost:8080");

socket.on("recv_message", (data) => {
  console.log(data);
});

const key1 = "e7d8d1dc3e7896c8992a49ec57861d0b8aca03c80b85ac30e782533a4f4598ca";
const key2 = "a14ee0b459280822e805b78ff305d70dcc0171f1606caecf576203bd997b11b3";
const u1 = { userName: "user.u1", hash: "hash", publicKey: "key" };
const u2 = { userName: "user.u2", hash: "hash", publicKey: "key" };

const testCreateUser = (u) => {
  axios.post("http://localhost:8080/api/createUser", u).then((res) => {
    console.log(res.data);
  });
};

const testGetPublicKey = () => {
  axios
    .post("http://localhost:8080/api/getPublicKey", {
      userName: "user.u1",
      sessionKey: key1,
      user: "u2",
    })
    .then((res) => {
      console.log(res.data);
    });
};

const testSocketConnect = (u, key) => {
  socket.emit(
    "new_connection",
    JSON.stringify({ userName: u, sessionKey: key })
  );
  const message = {
    timestamp: 1,
    id: 1,
    type: "text",
    sender: u,
    receiver: "user.u2",
    body: "Hello",
  };
  socket.emit(
    "send_message",
    JSON.stringify({ userName: u, sessionKey: key, message: message })
  );
};

const testValidateUser = (u) => {
  axios.post("http://localhost:8080/api/validateUser", u).then((res) => {
    testSocketConnect(u.userName, res.data.sessionKey);
  });
};

testValidateUser(u2);
testValidateUser(u1);
