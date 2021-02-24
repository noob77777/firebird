const express = require("express");
const { SERVER_PORT } = require("./constants");

const app = express();

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});
