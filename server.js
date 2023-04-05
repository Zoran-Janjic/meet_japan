const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDB = require("./db/connectDB");
const app = require("./index");
const PORT = process.env.PORT || 5000;
const colors = require("colors/safe");

/*
Connect to db and than start the server if connection is established
*/
connectDB(
  process.env.ATLAS_DB_DEVELOPMENT_URI,
  process.env.ATLAS_DB_DEVELOPMENT_PASSWORD
)
  .then(() => {
    console.log(
      colors.bgGreen.white.bold(
        "DB connection successful! Starting app server..."
      )
    );
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        colors.bgGreen.white.bold(`App running on port ${PORT}...SERVER.JS`)
      );
    });
  })
  .catch((err) => {
    console.log(
      colors.bgRed.white.bold(`Error connecting to database: ${err.message}`)
    );
  });
