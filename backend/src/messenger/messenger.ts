import { log, redisClient, Message, isMessage, io } from "../global";
import {
  ACK_MESSAGE,
  QUEUE_SUFFIX,
  RECV_MESSAGE,
  TYPE_ACK,
  USER_SERVER,
} from "../constants";
import auth from "../auth/auth";

class MessengerState {
  socketStore: { [key: string]: string } = {};
  socketStoreIndex: { [key: string]: string } = {};
  public addSocket = (userName: string, socketId: string): void => {
    this.socketStore[userName] = socketId;
    this.socketStoreIndex[socketId] = userName;
  };
  public removeSocket = (socketId: string): void => {
    if (socketId in this.socketStoreIndex) {
      const userName = this.socketStoreIndex[socketId];
      delete this.socketStore[userName];
      delete this.socketStoreIndex[socketId];
    }
  };
  public isUserActive = (userName: string): boolean => {
    return userName in this.socketStore;
  };
  public getSocket = (userName: string): string | null => {
    if (userName in this.socketStore) {
      return this.socketStore[userName];
    }
    return null;
  };
}

const messengerState = new MessengerState();

/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param callback
 */
const pendingMessages = (
  userName: string,
  sessionKey: string,
  callback: (messageList: Message[] | null) => void
): void => {
  auth.validateSession(userName, sessionKey, (success) => {
    const queueName = userName + "." + QUEUE_SUFFIX;
    if (success) {
      redisClient.lrange(queueName, 0, -1, (errLRange, result) => {
        if (errLRange) {
          log.error(errLRange.message);
          callback(null);
          return;
        }
        const ret = result.map((x) => JSON.parse(x)).filter(isMessage);
        redisClient.ltrim(queueName, ret.length, -1, (errLTrim) => {
          if (errLTrim) {
            log.error(errLTrim.message);
          }
        });
        callback(ret);
      });
    } else {
      callback(null);
    }
  });
};

const enQueue = (
  receiver: string,
  message: Message,
  callback: (success: boolean) => void
): void => {
  auth.userExists(receiver, (exists) => {
    if (exists) {
      const queue = receiver + "." + QUEUE_SUFFIX;
      redisClient.rpush(queue, JSON.stringify(message), (err) => {
        if (err) {
          log.error(err.message);
          callback(false);
          return;
        }
        callback(true);
      });
    } else {
      callback(false);
    }
  });
};

/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param socketID
 */
const addClient = (
  userName: string,
  sessionKey: string,
  socketID: string
): void => {
  auth.validateSession(userName, sessionKey, (success) => {
    if (success) {
      messengerState.addSocket(userName, socketID);
    }
  });
};

/**
 * @param socketID
 */
const removeClient = (socketID: string): void => {
  messengerState.removeSocket(socketID);
};

/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param message
 * @param callback
 */
const sendMessage = (
  userName: string,
  sessionKey: string,
  message: Message,
  callback: (success: boolean) => void
): void => {
  if (userName !== message.sender) {
    callback(false);
    return;
  }

  auth.validateSession(userName, sessionKey, (success) => {
    if (success) {
      if (messengerState.isUserActive(message.receiver)) {
        const socketId = messengerState.getSocket(message.receiver);
        if (!socketId) {
          callback(false);
          return;
        }
        io.to(socketId).emit(RECV_MESSAGE, JSON.stringify(message));
        callback(true);
      } else {
        enQueue(message.receiver, message, callback);
      }
    } else {
      callback(false);
    }
  });
};

/**
 * @param userName
 * @param messageId
 * @param success
 */
const sendAck = (
  userName: string,
  messageId: string,
  success: boolean
): void => {
  const ack: Message = {
    timestamp: Date.now(),
    id: messageId,
    type: TYPE_ACK,
    sender: USER_SERVER,
    receiver: userName,
    body: success,
  };
  const client = messengerState.getSocket(userName);
  if (client) {
    io.to(client).emit(ACK_MESSAGE, JSON.stringify(ack));
  } else {
    if (success) {
      log.warn(`ack dropped for for user: ${userName} with id: ${messageId}`);
    } else {
      log.warn(
        `both ack and message delivery failed for user: ${userName} with id: ${messageId}`
      );
    }
  }
};

const messenger = {
  pendingMessages,
  sendMessage,
  sendAck,
  addClient,
  removeClient,
};

export default messenger;
