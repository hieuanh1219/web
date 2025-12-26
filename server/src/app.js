const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const rateLimit = require("./middlewares/rateLimit.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const { requestId } = require("./middlewares/requestId.middleware");
const routes = require("./routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(requestId);
morgan.token("rid", (req) => req.requestId);
app.use(morgan(":rid :method :url :status :response-time ms - :res[content-length]"));

app.use(rateLimit);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
