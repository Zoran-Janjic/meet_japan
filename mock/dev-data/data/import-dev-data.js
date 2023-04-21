const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDB = require("../../../db/connectDB");
const colors = require("colors/safe");
const Tour = require("../../../models/Tour");

// ? Populate the database with test data

connectDB(
  process.env.ATLAS_DB_DEVELOPMENT_URI,
  process.env.ATLAS_DB_DEVELOPMENT_PASSWORD
).then(() => {
  console.log(colors.bgGreen.white.bold("DB connection successful!"));
});

// ? Read the mock data file
const allTours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// ? Import data to the database
const importDataToTourCollection = async () => {
  await Tour.create(allTours)
    .then((data) => {
      console.log(
        "Data added to the database. Total data added: ",
        data.length
      );

      process.exit(0);
    })
    .catch((err) => {
      console.log("ERROR POPULATING TOUR COLLECTION : ", err);

      process.exit(0);
    });
};

// ? Delete all data from the database
const deleteDatabaseTourCollection = async () => {
  await Tour.deleteMany()
    .then((data) => {
      console.log(
        "Data deleted to the database. Total data added: ",
        data.length
      );
      process.exit(0);
    })
    .catch((err) => {
      console.log("ERROR DELETING TOUR COLLECITON: ", err);

      process.exit(0);
    });
};
//  ? Use the terminal to add or remove data
if (process.argv[2] === "--importData") importDataToTourCollection();
if (process.argv[2] === "--deleteData") deleteDatabaseTourCollection();
