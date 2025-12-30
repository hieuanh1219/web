const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit = require("./middlewares/rateLimit.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { requestId } = require("./middlewares/requestId.middleware");

const { createLogger } = require("./utils/logger");
const { attachLogger } = require("./middlewares/logger.middleware");
const { httpLogger } = require("./middlewares/httpLogger.middleware");

const routes = require("./routes");

const app = express();
const logger = createLogger();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
//app.use(express.urlencoded({ extended: false })); (upload/file)
    
app.use(requestId);            // 1
app.use(attachLogger(logger)); // 2
app.use(httpLogger());         // 3

app.use(rateLimit);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
