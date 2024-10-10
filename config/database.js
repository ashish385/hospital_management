const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => {
      console.log("DB connection faild!");
      console.error(err);
      process.exit(1);
    });
};
