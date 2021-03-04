import { log, redisClient, Message, isMessage, io } from "../global";
import {
  ACK_MESSAGE,
  GROUP_PREFIX,
  QUEUE_SUFFIX,
  RECV_MESSAGE,
  TYPE_ACK,
  TYPE_IMAGE,
  USER_SERVER,
  USER_STATE_CHANGE,
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
  public getUser = (socketId: string): string | null => {
    if (socketId in this.socketStoreIndex) {
      return this.socketStoreIndex[socketId];
    }
    return null;
  };
}

const messengerState = new MessengerState();

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
      io.sockets.emit(
        USER_STATE_CHANGE,
        JSON.stringify({ userName, active: true })
      );
    }
  });
};

/**
 * @param socketID
 */
const getClient = (socketID: string): string | null => {
  const userName = messengerState.getUser(socketID);
  return userName;
};

/**
 * @param socketID
 */
const removeClient = (socketID: string): void => {
  const userName = messengerState.getUser(socketID);
  messengerState.removeSocket(socketID);
  if (userName) {
    io.sockets.emit(
      USER_STATE_CHANGE,
      JSON.stringify({ userName, active: false })
    );
  }
};

/**
 * [secure] [redis] [atomic]
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
    const queueName = userName + QUEUE_SUFFIX;
    if (success) {
      redisClient.watch(queueName, (errWatch) => {
        if (errWatch) {
          log.error(errWatch);
          callback(null);
          return;
        }
        redisClient.lrange(queueName, 0, -1, (errLRange, result) => {
          if (errLRange) {
            log.error(errLRange.message);
            callback(null);
            return;
          }
          const ret = result.map((x) => JSON.parse(x)).filter(isMessage);
          redisClient
            .multi()
            .ltrim(queueName, result.length, -1)
            .exec((errExec) => {
              if (errExec) {
                log.error(errExec.message);
                return;
              }
            });
          callback(ret);
        });
      });
    } else {
      callback(null);
    }
  });
};

const enQueueMessage = (
  receiver: string,
  message: Message,
  callback: (success: boolean) => void
): void => {
  auth.userExists(receiver, (exists) => {
    if (exists) {
      const queueName = receiver + QUEUE_SUFFIX;
      redisClient.rpush(queueName, JSON.stringify(message), (err) => {
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

const getGroupMembers = (
  group: string,
  callback: (users: string[] | null) => void
): void => {
  redisClient.lrange(group, 0, -1, (err, users) => {
    if (err) {
      log.error(err.message);
      callback(null);
      return;
    }
    callback(users);
  });
};

const sendMessageSingleUser = (
  receiver: string,
  message: Message,
  callback: (success: boolean) => void
): void => {
  if (messengerState.isUserActive(receiver)) {
    const socketId = messengerState.getSocket(receiver);
    if (!socketId) {
      callback(false);
      return;
    }
    io.to(socketId).emit(RECV_MESSAGE, JSON.stringify(message));
    callback(true);
  } else {
    if (message.type !== TYPE_IMAGE) {
      enQueueMessage(receiver, message, callback);
    } else {
      callback(false);
    }
  }
};

/**
 * [secure] [redis]
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
      if (message.receiver.startsWith(GROUP_PREFIX)) {
        getGroupMembers(message.receiver, (users) => {
          if (users && users.includes(userName)) {
            users.forEach((receiver) => {
              if (receiver !== userName) {
                sendMessageSingleUser(receiver, message, () => {
                  return;
                });
              }
            });
            callback(true);
          } else {
            callback(false);
          }
        });
      } else {
        sendMessageSingleUser(message.receiver, message, callback);
      }
    } else {
      callback(false);
    }
  });
};

/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param user
 * @param callback
 */
const getUserActive = (
  userName: string,
  sessionKey: string,
  user: string,
  callback: (active: boolean | null) => void
): void => {
  auth.validateSession(userName, sessionKey, (success) => {
    if (success) {
      callback(messengerState.isUserActive(user));
    } else {
      callback(null);
    }
  });
};

const messenger = {
  pendingMessages,
  sendMessage,
  sendAck,
  addClient,
  removeClient,
  getClient,
  getUserActive,
};

export default messenger;
