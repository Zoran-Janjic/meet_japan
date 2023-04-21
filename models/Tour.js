const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Tour must have a name."],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Tour must have a description."],
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price."],
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have a image cover."],
    },
    images: {
      type: [String],
      required: [true, "Tour must have images"],
      validate: {
        validator(value) {
          return value.length >= 1 && value.length <= 5;
        },
        message: "Tour must have between 1 and 5 images",
      },
    },
    discountPrice: { type: Number },
    ratingAverage: {
      type: Number,
      default: 0.0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    duration: { type: Number, required: [true, "Tour must have a duration."] },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have a Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have a difficulty."],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Tour must have a summary."],
    },
    startDates: {
      type: [Date],
      required: [true, "Tour must have start dates."],
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
