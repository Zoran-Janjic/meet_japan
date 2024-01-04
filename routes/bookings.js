const express = require("express");
const router = express.Router();
const applicationMiddleware = require("../middleware/index");
const bookingController = require("../controllers/bookingController");

router.post(
  "/checkout-session/:tourId",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  bookingController.getCheckoutSession
);

router.get(
  "/tour/:tour/user/:user/price/:price",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  applicationMiddleware.CreateBookingMiddleware.createBookingCheckout
);

// Get all bookings for the specific user
router.get(
  "/my_bookings",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  bookingController.getAllBookings
);

router.delete(
  "/my_bookings/booking/:id",
  applicationMiddleware.RouteProtect.protectedRoute,
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  bookingController.deleteBooking
);

// TODO Implement update booking
router.patch(
  "/my_bookings/:id",
  applicationMiddleware.RoleRestrictedRoute.restrictTo("user"),
  bookingController.updateBooking
);

module.exports = router;
