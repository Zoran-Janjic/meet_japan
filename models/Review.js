const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty."],
    },
    rating: { type: Number, min: 1, max: 5 },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const newObj = { ...ret };
        newObj.id = ret._id;
        delete newObj._id;
        delete newObj.__v;
        return newObj;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        const newObje = { ...ret };
        delete newObje._id;
        return newObje;
      },
    },
  }
);

// * Query middleware
/*
add custom logic to be executed before or after certain query methods
are executed on a MongoDB collection. This
*/

// ? Return all reviews with their tours and users
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// * End of  query middleware

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
