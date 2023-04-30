/* Because of the library, we do not
need the next(exception) call anymore.
The library handles everything under the hood.
If an exception occurs in an async route, the
execution is automatically passed to the express error\
 handling middleware. */
require("express-async-errors");

const express = require("express");
const unknownEndpointHandler = require("./routes/notFound");

const app = express();
const cors = require("cors");
// * Middleware
const Logger = require("./middleware/AppLogger");
const ErrorHandler = require("./middleware/ErrorHandler");
// * Routes
const tourRouter = require("./routes/tours");
const usersRouter = require("./routes/users");

//  * Middleware
app.use(express.json());
app.use(cors());

// ? Any middleware needed for development only
if (process.env.NODE_ENV !== "production") {
  app.use(Logger.requestLogger);
}

// ? Check how to serve images9
app.use(express.static(`${__dirname}/public`)); // ? Static files location

//  * Routers mounting
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", usersRouter);

// * Unknown endpoint
app.all("*", unknownEndpointHandler);
// this has to be the last loaded middleware.
app.use(ErrorHandler);

module.exports = app;
