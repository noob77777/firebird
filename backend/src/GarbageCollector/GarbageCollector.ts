import {
  BROADCAST_GROUP,
  GARBAGE_COLLECTOR_MAX_AGE,
  GARBAGE_COLLECTOR_RUN_INTERVAL,
  QUEUE_SUFFIX,
} from "../constants";
import { log, redisClient, isMessage } from "../global";

class GarbageCollector {
  private runGarbageCollector = (): void => {
    log.info("garbage collection started");

    redisClient.lrange(BROADCAST_GROUP, 0, -1, (errLRangeUsers, users) => {
      if (errLRangeUsers) {
        log.error(errLRangeUsers.message);
        return;
      }

      users.forEach((user) => {
        const queueName = user + QUEUE_SUFFIX;

        redisClient.watch(queueName, (errWatch) => {
          if (errWatch) {
            log.error(errWatch.message);
            return;
          }

          redisClient.lrange(queueName, 0, -1, (errLRangeQueue, result) => {
            if (errLRangeQueue) {
              log.error(errLRangeQueue.message);
              return;
            }

            const timestamp = Date.now();
            const messages = result
              .map((message) => JSON.parse(message))
              .filter(isMessage)
              .filter(
                (message) =>
                  message.timestamp + GARBAGE_COLLECTOR_MAX_AGE >= timestamp
              )
              .map((message) => JSON.stringify(message));

            if (messages.length === result.length) {
              return;
            }

            if (messages.length !== 0) {
              redisClient
                .multi()
                .ltrim(queueName, result.length, -1)
                .rpush(queueName, messages)
                .exec((errExec) => {
                  if (errExec) {
                    log.error(errExec.message);
                    return;
                  }

                  log.info(
                    `garbage collection completed for queue: ${queueName} removed: ${
                      result.length - messages.length
                    } old messages`
                  );
                });
            } else {
              redisClient
                .multi()
                .ltrim(queueName, result.length, -1)
                .exec((errExec) => {
                  if (errExec) {
                    log.error(errExec.message);
                    return;
                  }

                  log.info(
                    `garbage collection completed for queue: ${queueName} removed: ${
                      result.length - messages.length
                    } old messages`
                  );
                });
            }
          });
        });
      });
    });
  };

  public start = (): void => {
    setInterval(this.runGarbageCollector, GARBAGE_COLLECTOR_RUN_INTERVAL);
  };
}

const garbageCollector = new GarbageCollector();
export default garbageCollector;
