const pino = require("pino");

function createLogger() {
  const isProd = process.env.NODE_ENV === "production";

  return pino(
    {
      level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
      base: null,
    },
    isProd
      ? undefined
      : require("pino-pretty")({
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        })
  );
}

module.exports = { createLogger };
