const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find().populate({
    path: "tour",
    select: "name",
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", totalReviews: reviews.length, reviews });
};

const getSingleTourReview = async (req, res) => {
  const reviews = await Review.find({ tour: req.params.tourId }).populate({
    path: "tour",
    select: "name",
  });

  res
    .status(StatusCodes.OK)
    .json({ status: "success", results: reviews.length, reviews });
};

const createReview = async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ status: "success", newReview });
};

module.exports = { getAllReviews, createReview, getSingleTourReview };
