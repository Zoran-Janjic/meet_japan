const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Tour must have a name."],
      unique: true,
      maxLength: [
        50,
        "Tour name must have less than or equal then 50 characters.",
      ],
      minLength: [10, "Tour name must be at least 10 characters."],
      validate: {
        validator: /^[a-zA-Z\s]+$/,
        message: "Tour name can only contain characters and spaces.",
      },
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Tour must have a description."],
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price."],
      min: [0, "Price must be at least 0."],
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
    discountPrice: {
      type: Number,
      validate: {
        validator(value) {
          return value < this.price;
        },
        message:
          "Tour discount must be less or equal to the tour regular price.",
      },
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating must be between 0 and 5"],
      max: [5, "Rating must be between 0 and 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0."],
    },
    duration: {
      type: Number,
      required: [true, "Tour must have a duration."],
      min: [0, "Duration must be at least 0."],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have a Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "Tour must have a difficulty."],
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty must be either: easy, medium or hard",
      },
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
    // * Private custom tours
    privateTour: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
    },
    startLocation: {
      // ? Geo Json
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: "Point", enum: ["Point"] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
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

// * Virtual properties
/*
  virtual properties are fields that are not stored in the database,
  but are calculated on-the-fly based on other fields in the document.
  Virtual properties can be useful for adding additional computed properties
  to a document without actually storing them in the database.
  - Virtuals cannot be used in a query as they are not saved to the database but
   made on the database query
*/

tourSchema.virtual("tourDurationInWeeks").get(function () {
  return this.duration / 7;
});

// * Document middleware
/*
allows you to add custom logic to be executed before or after certain
events occur on a MongoDB document. This middleware can be used to perform
various tasks, such as validation, data transformation, or triggering other
actions based on changes to a document.
*/

// ? Runs before the document .save() or .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// * Query middleware
/*
add custom logic to be executed before or after certain query methods
are executed on a MongoDB collection. This
*/

/*
  Don't return the tour if it is private for all the find methods
  Populate the guides field for the tours
*/
tourSchema.pre(/^find/, function (next) {
  console.log("object");
  this.populate({ path: "guides" });
  this.find({ privateTour: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
