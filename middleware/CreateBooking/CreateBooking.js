const Booking = require("../../models/Booking");
const Tour = require("../../models/Tour");

const createBookingCheckout = async (req, res) => {
  // ! Temporary solution
  const { tour, user, price } = req.params;

  if (!tour || !user || !price) {
    return res.redirect("http://localhost:3000/checkout/cancel");
  }

  const existingTour = await Tour.findById(tour);

  if (!existingTour) {
    return res.status(400).json({ msg: "Tour not found", status: "Failed" });
  }

  const a = await Booking.create({ tour, user, price });

  console.log(a);

  res.redirect("http://localhost:3000/booking/success");
};

module.exports = { createBookingCheckout };
