import express from "express";
import SimpleNodeLogger from "simple-node-logger";
import { SERVER_PORT, LOG_FILE } from "./constants";

const app = express();
const log = SimpleNodeLogger.createSimpleFileLogger(LOG_FILE);

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.listen(SERVER_PORT, () => {
  log.info(`Example app listening at http://localhost:${SERVER_PORT}`);
});
