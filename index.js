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
const authRouter = require("./routes/auth");
const reviewRouter = require("./routes/reviews");
const adminRouter = require("./routes/admin");
// * Security
const security = require("./helpers/Security");

//  * Middleware

// ? Body parser, reading data from request body to req.body and limit payload to 10kb
app.use(express.json({ limit: "20kb" }));
// ? Enable CORS middleware
app.use(cors());

// ! Production environment
if (process.env.NODE_ENV === "production") {
  app.use("/api/v1", security.rateLimiterConfig);
  app.use(security.configuredHelmet());
  app.use(security.userDataSanitizer());
  app.use(security.xssSanitizer());
  app.use(security.preventParameterPollution());
}
// ! Any middleware needed for development only
if (process.env.NODE_ENV !== "production") {
  app.use(Logger.requestLogger);
}

// ? Check how to serve images
app.use(express.static(`${__dirname}/public`)); // ? Static files location

// * End of middleware

//  * Routers mounting
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
// * Unknown endpoint
app.all("*", unknownEndpointHandler);
// * This has to be the last loaded middleware. So it can catch all errors
app.use(ErrorHandler);
module.exports = app;
