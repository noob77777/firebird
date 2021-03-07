const axios = require("axios");
const crypto = require("crypto");
const io = require("socket.io-client");

const TIME = 60000;
const N = 87;

const stats = {
  users_created: 0,
  sent: 0,
  recevied: 0,
  ack_received: 0,
};

const intervalM = setInterval(() => {
  console.log(stats);
}, 1000);

setTimeout(() => {
  const finalStats = { ...stats };
  finalStats.sent /= TIME / 1000;
  finalStats.recevied /= TIME / 1000;
  finalStats.ack_received /= TIME / 1000;
  finalStats.ack_percentage = finalStats.ack_received / finalStats.sent;
  console.log(finalStats);
  clearInterval(intervalM);
}, TIME);

const user = async () => {
  const u = {
    userName:
      "user." +
      crypto.createHash("md5").update(Date.now().toString()).digest("hex"),
    hash: "hash",
    publicKey: "key",
  };

  const socket = io("http://localhost:8080");
  socket.on("recv_message", () => {
    stats.recevied += 1;
  });
  socket.on("ack_message", () => {
    stats.ack_received += 1;
  });

  const api = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 1000,
  });

  try {
    await api.post("/api/createUser", u);
    stats.users_created += 1;

    const res = await api.post("/api/validateUser", {
      userName: u.userName,
      hash: u.hash,
    });
    u.sessionKey = res.data.sessionKey;

    socket.emit(
      "new_connection",
      JSON.stringify({ userName: u.userName, sessionKey: u.sessionKey })
    );

    const f = () => {
      const timestamp = Date.now();
      const message = {
        timestamp: timestamp,
        id: crypto
          .createHash("md5")
          .update(timestamp + "." + u.userName)
          .digest("hex"),
        type: "text",
        sender: u.userName,
        receiver: "group.broadcast",
        body: crypto.randomBytes(1024).toString(),
      };
      socket.emit(
        "send_message",
        JSON.stringify({
          userName: u.userName,
          sessionKey: u.sessionKey,
          message: message,
        })
      );
      stats.sent += 1;
    };
    const interval = setInterval(f, 10);
    setTimeout(() => {
      clearInterval(interval);
    }, TIME);
  } catch (err) {
    console.log(err);
  }
};

for (let i = 0; i < N; i++) {
  user();
}
