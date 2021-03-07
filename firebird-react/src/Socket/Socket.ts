import io from "socket.io-client";
import { FIREBIRD_SERVER } from "../constants";

export const socket = io(FIREBIRD_SERVER);
