const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDB = require("../../../db/connectDB");
const colors = require("colors/safe");
const Tour = require("../../../models/Tour");
const Review = require("../../../models/Review");
const User = require("../../../models/User");

// ? Populate the database with test data

connectDB(
  process.env.ATLAS_DB_DEVELOPMENT_URI,
  process.env.ATLAS_DB_DEVELOPMENT_PASSWORD
).then(() => {
  console.log(colors.bgGreen.white.bold("DB connection successful!"));
});

// ? Read the mock data file
const allTours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);
const allUsers = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);
const allReviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
// ? Import data to the database
const importDataToTourCollection = async () => {
  try {
    await Promise.all([
      Review.create(allReviews),
      // ? Skip validation for when adding dev data
      User.create(allUsers, { validateBeforeSave: false }),
      Tour.create(allTours),
    ]);

    console.log("Data added to the database.");
  } catch (err) {
    console.log("ERROR POPULATING TOUR COLLECTION: ", err);
  }
  process.exit(0);
};

// ? Delete all data from the database
const deleteDatabaseTourCollection = async () => {
  try {
    await Promise.all([
      Review.deleteMany(),
      User.deleteMany(),
      Tour.deleteMany(),
    ]);

    console.log("Data deleted from the database.");
  } catch (err) {
    console.log("ERROR DELETING TOUR COLLECTION: ", err);
  }

  process.exit(0);
};
//  ? Use the terminal to add or remove data
if (process.argv[2] === "--importData") importDataToTourCollection();
if (process.argv[2] === "--deleteData") deleteDatabaseTourCollection();
