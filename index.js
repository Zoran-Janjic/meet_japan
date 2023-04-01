const express = require("express");

const app = express();
const cors = require("cors");
const Logger = require("./middleware/AppLogger");
const tourRouter = require("./routes/tours");
const usersRouter = require("./routes/users");

//  * Middleware
app.use(express.json());
app.use(cors());

// ? Any middleware needed for development only
if (process.env.NODE_ENV !== "production") {
  app.use(Logger.requestLogger);
}

// ? Check how to serve images
app.use(express.static(`${__dirname}/public`)); // ? Static files location

//  * Routers mounting
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", usersRouter);

// * Unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "No such endpoint." });
};
app.use(unknownEndpoint);
module.exports = app;
