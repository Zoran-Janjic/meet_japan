const express = require("express");

const userRouter = express.Router();
const usersController = require("../controllers/usersController");

userRouter
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

userRouter
  .route("/:userId")
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = userRouter;
