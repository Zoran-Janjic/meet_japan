const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Booking must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user."],
    },
    price: {
      type: Number,
      required: [true, "Booking must have a price."],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
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

// * Populate tour and user on booking query
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "name imageCover startDates startLocation guides",
  }).populate({ path: "user", select: "name email" });
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
