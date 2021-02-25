import { log, redisClient, User, isUser, Message, isMessage } from "../global";
import { QUEUE_SUFFIX } from "../constants";
import auth from "../auth/auth";

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

const sendMessage = (
  userName: string,
  sessionKey: string,
  message: Message,
  callback: (success: boolean) => void
): void => {
  auth.validateSession(userName, sessionKey, (success) => {
    if (success) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

const messenger = { pendingMessages };
export default messenger;
