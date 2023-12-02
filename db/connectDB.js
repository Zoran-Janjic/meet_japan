const mongoose = require("mongoose");
const colors = require("colors/safe");

class DBConnectionClass {
  static DBConnectionInstance; // ? Variable to hold the singleton instance

  static DBConnectionStatus = false; // ? Flag to track connection status

  constructor(uri, dbPassword) {
    if (DBConnectionClass.DBConnectionInstance) {
      // ? Ensure only one instance is created
      throw new Error("Only one DBConnection instance can be created.");
    }

    if (!uri || !dbPassword) {
      // ? Check if uri or dbPassword is undefined or empty
      throw new Error("URI and dbPassword must be provided.");
    }

    this.connectionUrlWithPassword = uri.replace("<PASSWORD>", dbPassword);
    // ? Freeze the instance to prevent modifications
    DBConnectionClass.DBConnectionInstance = Object.freeze(this);
  }

  async connect() {
    if (DBConnectionClass.DBConnectionStatus) {
      console.log("Already connected.");
      throw new Error("Already connected.");
    }

    console.log(
      colors.bgYellow.bold(`Connecting to ${this.connectionUrlWithPassword}`)
    );

    mongoose.set("strictQuery", false);
    try {
      const conn = await mongoose.connect(this.connectionUrlWithPassword, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(
        colors.bgGreen.white.bold(
          "DB connection successful! Starting app server..."
        )
      );
      console.log(
        colors.bgWhite.white.bold(`Current NODE_ENV ${process.env.NODE_ENV}`)
      );
      DBConnectionClass.DBConnectionStatus = true;
      return conn;
    } catch (error) {
      console.log(error);
      console.log(`Error connecting to ${this.connectionUrlWithPassword}`);
      throw error; // Rethrow the error to handle it elsewhere
    }
  }

  static async disconnect() {
    if (DBConnectionClass.DBConnectionStatus) {
      await mongoose.disconnect();
      console.log("Database disconnected.");
      DBConnectionClass.DBConnectionStatus = false;
    } else {
      throw new Error("Not connected.");
    }
  }
}

module.exports = DBConnectionClass; // ? Export the DBConnectionClass as a module
