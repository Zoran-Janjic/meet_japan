const express = require("express");

const userRouter = express.Router();
const usersController = require("../controllers/usersController");
const applicationMiddleware = require("../middleware/index");

userRouter
  .route("/")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUser
  );

userRouter
  .route("/")
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.updateUser
  );

userRouter
  .route("/:userId")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUser
  )
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.deleteUser
  );

module.exports = userRouter;
