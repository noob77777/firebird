const axios = require("axios");

axios
  .post("http://localhost:8080/api/createUser", {
    userName: "test2",
    hash: "hash",
    publicKey: "key",
  })
  .then((res) => {
    console.log(res.data);
  });
