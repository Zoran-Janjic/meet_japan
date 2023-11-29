/* eslint-disable max-len */
const { StatusCodes } = require("http-status-codes");
const Tour = require("../models/Tour");
// const ControllerHandlerFactory = require("../helpers/FactoryHandlerFunctions/ControllerHandlerFactory");
// const DatabaseOperationsConstants = require("../helpers/Constants/DatabaseOperationsConstants");
// const BadRequestError = require("../errors/index");
const createHttpResponse = require("../helpers/createHttpResponse");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res) => {
  // ? Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // ? Create the checkout session

  // Step 2: Create a Stripe Checkout session using the `stripe.checkout.sessions.create` method.
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "price_1OHbj1IJzw20tdGpCZi9wvz0",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/checkout/success",
    cancel_url: "http://localhost:3000/checkout/cancel",
  });

  return createHttpResponse(
    res,
    StatusCodes.OK,
    "Success",
    "Session established.",
    session.url
  );
};

module.exports = { getCheckoutSession };
