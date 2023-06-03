const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find();

  res
    .status(StatusCodes.OK)
    .json({ status: "success", totalReviews: reviews.length, reviews });
};

const createReview = async (req, res) => {
  const newReview = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ status: "success", newReview });
};

module.exports = { getAllReviews, createReview };
