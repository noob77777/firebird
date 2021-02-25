const axios = require("axios");

const testCreateUser = () => {
  axios
    .post("http://localhost:8080/api/createUser", {
      userName: "test",
      hash: "hash",
      publicKey: "key",
    })
    .then((res) => {
      console.log(res.data);
    });
};

const testValidateUser = () => {
  axios
    .post("http://localhost:8080/api/validateUser", {
      userName: "test",
      hash: "hash",
      publicKey: "key",
    })
    .then((res) => {
      console.log(res.data);
    });
};

const testGetPublicKey = () => {
  axios
    .post("http://localhost:8080/api/getPublicKey", {
      userName: "test",
      sessionKey:
        "c3fd0de9378a00414e6d71ad2932f9b0b45ed14e1fd6cdf029c80540498cba5d",
      user: "test",
    })
    .then((res) => {
      console.log(res.data);
    });
};
