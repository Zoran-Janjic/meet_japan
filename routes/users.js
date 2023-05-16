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
  .route("/all")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUsers
  );

userRouter
  .route("/")
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.updateUser
  );

userRouter
  .route("/")
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.deleteSelfUser
  );

userRouter
  .route("/:userId")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUser
  );

module.exports = userRouter;
