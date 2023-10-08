const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DBConnectionClass = require("./db/connectDB");
const app = require("./index");
const PORT = process.env.PORT || 5000;
const colors = require("colors/safe");

// ? Catch error at startup
process.on("uncaughtException", (err) => {
  console.log(`Uncaught error occurred: ${(err.name, err.message)}`);
  console.log("Shutting down server.");
  process.exit(1);
});

/*
Connect to db and than start the server if connection is established
The following code assumes you have the necessary environment variables defined before running it.
Create a new instance of DBConnectionClass with the provided URI and password
*/

const DatabaseConnection = new DBConnectionClass(
  process.env.ATLAS_DB_DEVELOPMENT_URI,
  process.env.ATLAS_DB_DEVELOPMENT_PASSWORD
);

DatabaseConnection.connect()
  .then(() =>
    app.listen(PORT, () => {
      console.log(
        colors.bgGreen.white.bold(`App running on port ${PORT}...SERVER.JS`)
      );
    }))
  .catch((err) => {
    console.log(
      colors.bgRed.white.bold(`Error connecting to database: ${err.message}`)
    );
  });
