const pino = require("pino");

function createLogger() {
  const isProd = process.env.NODE_ENV === "production";

  // Dev: log đẹp dễ đọc; Prod: log JSON để đưa vào log system
  const transport = isProd
    ? undefined
    : pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      });

  return pino(
    {
      level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
      base: null, // bỏ pid/hostname mặc định cho gọn
    },
    transport
  );
}

module.exports = { createLogger };
