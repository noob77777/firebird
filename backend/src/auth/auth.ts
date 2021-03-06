import { log, redisClient, User, isUser } from "../global";
import { BROADCAST_GROUP, SESSION_AUTO_TIMEOUT } from "../constants";
import crypto from "crypto";

class SessionStore {
  sessions: { [key: string]: string } = {};
  public addSession = (userName: string, sessionKey: string): void => {
    this.sessions[userName] = sessionKey;
    setTimeout(() => removeSession(userName), SESSION_AUTO_TIMEOUT);
  };
  public getSession = (userName: string): string => {
    return this.sessions[userName];
  };
  public removeSession = (userName: string): void => {
    delete this.sessions[userName];
    log.warn(`Session auto timeout for ${userName}`);
  };
}

const sessionStore: SessionStore = new SessionStore();

/**
 * @param userName
 */
const removeSession = (userName: string): void => {
  sessionStore.removeSession(userName);
};

/**
 * [secure] [redis] [atomic]
 * @param userName
 * @param hash
 * @param publicKey
 * @param callback
 */
const createUser = (
  userName: string,
  hash: string,
  publicKey: string,
  callback: (success: boolean) => void
): void => {
  const user: User = {
    userName,
    hash,
    publicKey,
    contacts: [],
  };

  redisClient.watch(userName, (errWatch) => {
    if (errWatch) {
      log.error(errWatch.message);
      callback(false);
      return;
    }
    redisClient.get(userName, (errGet, resultGet) => {
      if (errGet) {
        log.error(errGet.message);
        callback(false);
        return;
      }
      if (!resultGet) {
        redisClient
          .multi()
          .set(userName, JSON.stringify(user))
          .rpush(BROADCAST_GROUP, userName)
          .exec((errExec, resultExec) => {
            if (errExec) {
              log.error(errExec.message);
              callback(false);
              return;
            }
            callback(resultExec ? true : false);
          });
      } else {
        callback(false);
      }
    });
  });
};

/**
 * [secure] [redis]
 * @param userName
 * @param hash
 * @param callback
 */
const validateUser = (
  userName: string,
  hash: string,
  callback: (sessionKey: string | null) => void
): void => {
  redisClient.get(userName, (err, result) => {
    if (err) {
      log.error(err.message);
      callback(null);
      return;
    }
    if (result) {
      const user = JSON.parse(result);
      if (isUser(user) && user.hash === hash) {
        const sessionKey = generateSessionKey(userName);
        sessionStore.addSession(userName, sessionKey);
        callback(sessionKey);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * [secure]
 * @param userName
 * @param sessionKey
 * @param callback
 */
const validateSession = (
  userName: string,
  sessionKey: string,
  callback: (success: boolean) => void
): void => {
  if (sessionStore.getSession(userName) === sessionKey) {
    callback(true);
  } else {
    callback(false);
  }
};

/**
 * [secure] [redis]
 * @param userName
 * @param sessionKey
 * @param user
 * @param callback
 */
const getPublicKey = (
  userName: string,
  sessionKey: string,
  user: string,
  callback: (publicKey: string | null) => void
): void => {
  validateSession(userName, sessionKey, (success) => {
    if (success) {
      redisClient.get(user, (err, result) => {
        if (err) {
          log.error(err.message);
          callback(null);
          return;
        }
        if (result) {
          const u = JSON.parse(result);
          if (isUser(u) && u.publicKey) {
            callback(u.publicKey);
            return;
          }
        }
        callback(null);
      });
    } else {
      callback(null);
    }
  });
};

/**
 * @param userName
 * @param callback
 */
const userExists = (
  userName: string,
  callback: (exists: boolean) => void
): void => {
  redisClient.get(userName, (err, result) => {
    if (err) {
      log.error(err.message);
      callback(false);
      return;
    }
    if (!result) {
      callback(false);
      return;
    }
    const u = JSON.parse(result);
    if (u && isUser(u)) {
      callback(true);
      return;
    }
    callback(false);
  });
};

const generateSessionKey = (userName: string): string => {
  const key = userName + "." + Date.now().toString();
  return crypto.createHash("sha256").update(key).digest("hex");
};

/**
 * [secure] [redis] [atomic]
 * @param userName
 * @param sessionKey
 * @param groupName
 * @param callback
 */
const createGroup = (
  userName: string,
  sessionKey: string,
  groupName: string,
  callback: (success: boolean) => void
): void => {
  validateSession(userName, sessionKey, (success) => {
    if (success) {
      redisClient.watch(groupName, (errWatch) => {
        if (errWatch) {
          log.error(errWatch.message);
          callback(false);
          return;
        }
        redisClient.lrange(groupName, 0, -1, (errLRange, resultLRange) => {
          if (errLRange) {
            log.error(errLRange.message);
            callback(false);
            return;
          }
          if (resultLRange.length === 0) {
            redisClient
              .multi()
              .rpush(groupName, userName)
              .exec((errExec, resultExec) => {
                if (errExec) {
                  log.error(errExec.message);
                  callback(false);
                  return;
                }
                callback(resultExec ? true : false);
              });
          } else {
            callback(false);
          }
        });
      });
    } else {
      callback(false);
    }
  });
};

/**
 * [secure] [redis]
 * @param userName
 * @param sessionKey
 * @param group
 * @param callback
 */
const getGroupMembers = (
  userName: string,
  sessionKey: string,
  group: string,
  callback: (users: string[] | null) => void
): void => {
  validateSession(userName, sessionKey, (success) => {
    if (success) {
      redisClient.lrange(group, 0, -1, (err, users) => {
        if (err) {
          log.error(err.message);
          callback(null);
          return;
        }
        if (users.includes(userName)) {
          callback(users);
        } else {
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  });
};

/**
 * [sucure] [redis]
 * @param userName
 * @param sessionKey
 * @param group
 * @param callback
 */
const joinGroup = (
  userName: string,
  sessionKey: string,
  group: string,
  callback: (success: boolean) => void
): void => {
  validateSession(userName, sessionKey, (success) => {
    if (success) {
      redisClient.lrange(group, 0, -1, (errLrange, result) => {
        if (errLrange) {
          log.error(errLrange.message);
          callback(false);
          return;
        }
        if (result.length !== 0) {
          if (!result.includes(userName)) {
            redisClient.rpush(group, userName, (errRPush) => {
              if (errRPush) {
                log.error(errRPush.message);
                callback(false);
                return;
              }
              callback(true);
            });
          } else {
            callback(true);
          }
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  });
};

const auth = {
  createUser,
  validateUser,
  validateSession,
  getPublicKey,
  userExists,
  createGroup,
  getGroupMembers,
  joinGroup,
  removeSession,
};

export default auth;
