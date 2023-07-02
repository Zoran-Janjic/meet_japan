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

//  * Virtual properties

// * End of virtual properties

const TourGuideReviewModel = mongoose.model(
  "TourGuideReview",
  TourGuideReviewSchema
);

module.exports = TourGuideReviewModel;
