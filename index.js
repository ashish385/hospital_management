// app.js
const express = require("express");
const database = require("./config/database")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");

dotenv.config();
database.connect();

const app = express();
const port = process.env.PORT || 8800;


app.use(express.json()); 
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

// Routes
app.use("/api/v1",require("./routes/indexRoutes"));

// def routes
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...."
    })
});

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else {
  console.log("Running in development mode");
}
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
