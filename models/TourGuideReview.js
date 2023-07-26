const mongoose = require("mongoose");
// const UserModel = require("./User");

const TourGuideReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required."],
    },
    tourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tour guide reference is required."],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required."],
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

// * Document middleware
/*
Allows you to add custom logic to be executed before or after certain
events occur on a MongoDB document. This middleware can be used to perform
various tasks, such as validation, data transformation, or triggering other
actions based on changes to a document.
*/

TourGuideReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" }).populate({
    path: "tourGuide",
    select: "name photo",
  });
  next();
});

// * End of document middleware
//  * Virtual properties

// * End of virtual properties

// * Static methods

// * End of static methods

const TourGuideReviewModel = mongoose.model(
  "TourGuideReview",
  TourGuideReviewSchema
);

module.exports = TourGuideReviewModel;
