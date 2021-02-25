import SimpleNodeLogger from "simple-node-logger";
import redis from "redis";
import { LOG_FILE_PATH, REDIS_HOST, REDIS_PORT } from "./constants";

export const log = SimpleNodeLogger.createSimpleFileLogger(LOG_FILE_PATH);
export const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export interface User {
  userName: string;
  hash: string;
  publicKey: string;
  contacts: string[];
  socket?: string;
  sessionKey?: string;
}

export const isUser = (o: any): o is User => {
  return "userName" in o && "hash" in o && "publicKey" in o && "contacts" in o;
};

export interface Message {
  timestamp: number;
  id: number;
  type: string;
  sender: string;
  receiver: string;
  body: any;
}

export const isMessage = (o: any): o is Message => {
  return (
    "timestamp" in o &&
    "id" in o &&
    "type" in o &&
    "sender" in o &&
    "receiver" in o &&
    "body" in o
  );
};
