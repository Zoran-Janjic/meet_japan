const express = require("express");

const userRouter = express.Router();
const usersController = require("../controllers/usersController");
const applicationMiddleware = require("../middleware/index");

userRouter
  .route("/")
  // .get( ADD LATER FOR  /ME
  //   applicationMiddleware.RouteProtect.protectedRoute,
  //   usersController.getUser
  // )
  .patch(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.updateUser
  )
  .delete(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.deleteSelfUser
  );

userRouter
  .route("/all")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUsers
  );

userRouter
  .route("/:id")
  .get(
    applicationMiddleware.RouteProtect.protectedRoute,
    usersController.getUser
  );

module.exports = userRouter;
