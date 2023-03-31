const express = require("express");

const userRouter = express.Router();
const usersController = require("../controllers/usersController");

userRouter
  .route("/api/v1/users")
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

userRouter
  .route("/api/v1/users/:userId")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = userRouter;
