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
const cookieParser = require("cookie-parser");

//  * Middleware

// ? Body parser, reading data from request body to req.body and limit payload to 10kb
app.use(express.json({ limit: "20kb" }));
// ? Cookie parser that parses data from cookie
app.use(cookieParser());
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

// ! Check how to serve images
app.use(express.static(`${__dirname}/public`)); // ? Static files location

// * Test middleware 
// ! Remove later
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });
// * End of middleware

//  * Routers mounting
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/admin", adminRouter);
// * The starting API call for GET /
app.get("/", (req, res) => {
  res.send(
    "Welcome to my meet japan api. You can view the documentation here: https://documenter.getpostman.com/view/25275561/2s93z9bhMZ#intro"
  );
});
// * Unknown endpoint
app.all("*", unknownEndpointHandler);
// * This has to be the last loaded middleware. So it can catch all errors
app.use(ErrorHandler);
module.exports = app;
