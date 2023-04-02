const mongoose = require("mongoose");

const connectDB = (url, dbPassword) => {
  const connectionUrlWithPassword = url.replace("<PASSWORD>", dbPassword);
  mongoose.set("strictQuery", false);
  return mongoose.connect(connectionUrlWithPassword, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
