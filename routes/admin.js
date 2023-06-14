const express = require("express");

const adminRouter = express.Router();
const adminController = require("../controllers/adminController");

adminRouter
  .route("/:id")
  .delete(adminController.deleteUserByAdmin)
  .patch(adminController.updateUserDetails);

module.exports = adminRouter;
