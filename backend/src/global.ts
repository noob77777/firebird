import express from "express";
import { Server } from "socket.io";
import SimpleNodeLogger from "simple-node-logger";
import redis from "redis";
import http from "http";
import https from "https";
import fs from "fs";
import {
  LOG_FILE_PATH,
  REDIS_HOST,
  REDIS_PORT,
  SSL_CERT_PATH,
  SSL_KEY_PATH,
} from "./constants";

export const log = SimpleNodeLogger.createSimpleFileLogger(LOG_FILE_PATH);
export const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const key = fs.readFileSync(SSL_KEY_PATH);
const cert = fs.readFileSync(SSL_CERT_PATH);
const options = {
  key,
  cert,
};

export const app = express();
export const serverHTTP = http.createServer(app);
export const serverHTTPS = https.createServer(options, app);
export const io = new Server();

export interface User {
  userName: string;
  hash: string;
  publicKey: string;
  contacts: string[];
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
