const express = require("express");

const userRouter = express.Router();
const usersController = require("../controllers/usersController");
const applicationMiddleware = require("../middleware/index");

userRouter
  .route("/")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getAllUsers
  );

userRouter
  .route("/:userId")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUser
  )
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.updateUser
  )
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.deleteUser
  );

module.exports = userRouter;
