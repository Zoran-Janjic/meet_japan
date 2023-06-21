const mongoose = require("mongoose");
const TourModel = require("./Tour");

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

//! Creating custom indexes only on most queried data
/*  One review per user as the combination of a user and a review has to be unique
This means that there cannot be multiple reviews with the same tour
and user values. If an attempt is made to insert a duplicate review
with the same tour and user, it will result in an error.
*/
reviewSchema.indexes({ tour: 1, user: 1 }, { unique: true });

//* Static model functions
// ? Get average review for a tour
reviewSchema.statics.calculateAverageRating = async function (currentTourId) {
  // ?Calculate review statistics using aggregation pipeline
  const reviewStats = await this.aggregate([
    { $match: { tour: currentTourId } },
    {
      $group: {
        _id: "$tour",
        totalRatings: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (reviewStats.length > 0) {
    // ?Update the corresponding tour document with the calculated statistics
    await TourModel.findByIdAndUpdate(currentTourId, {
      ratingAverage: reviewStats[0].averageRating,
      ratingQuantity: reviewStats[0].totalRatings,
    });
  } else {
    // ?Update the corresponding tour document with the calculated statistics
    await TourModel.findByIdAndUpdate(currentTourId, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
  }
};
// * End of Static model functions

// * Query middleware
/*
add custom logic to be executed before or after certain query methods
are executed on a MongoDB collection.
*/

// ? Return all reviews with their tours and users
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// ? Once a new review has been added then we update the ratingAverage and
// ? ratingQuantity for the tour which the review belongs to
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.tour);
});
// ? Updating and deleting the review and updating the correct tour details according to the
// ? Works for find one and update and find and delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // ? Get access to the current document
  this.currentReview = await this.clone().findOne();
  next();
});
// ? We passed the data from the pre middleware to the post middleware so
// ? we can get the the current review and the tour id
reviewSchema.post(/^findOneAnd/, async function () {
  // ? await this.findOne() does not work here as the query has already executed
  if (this.currentReview) {
    await this.currentReview.constructor.calculateAverageRating(
      this.currentReview.tour
    );
  }
});

// * End of  query middleware

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
