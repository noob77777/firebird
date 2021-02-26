export const SERVER_PORT_HTTP: number = 8080;
export const SERVER_PORT_HTTPS: number = 8443;
export const REDIS_HOST: string = "127.0.0.1";
export const REDIS_PORT: number = 6379;

export const LOG_FILE_PATH: string = "firebird_backend.log";
export const SSL_CERT_PATH: string = "./certs/firebird.crt";
export const SSL_KEY_PATH: string = "./certs/firebird.key";

export const USER_PREFIX: string = "user";
export const GROUP_PREFIX: string = "group";
export const BROADCAST_GROUP: string = "group.broadcast";
export const USER_SERVER: string = "user.firebird";
export const SOCKET_INDEX_SUFFIX: string = "socket";
export const QUEUE_SUFFIX: string = "queue";

export const NEW_CONNECTION: string = "new_connection";
export const SEND_MESSAGE: string = "send_message";
export const RECV_MESSAGE: string = "recv_message";
export const ACK_MESSAGE: string = "ack_message";

export const TYPE_TEXT: string = "text";
export const TYPE_ACK: string = "ack";
export const TYPE_IMAGE: string = "image";
