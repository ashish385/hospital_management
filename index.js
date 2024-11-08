// app.js
const express = require("express");
const database = require("./config/database")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
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
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient",patientRoutes );
app.use("/api/v1/service",require("./routes/serviceRoutes") );
app.use("/api/v1/Procedure", require("./routes/procedureRoutes"));

// def routes
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...."
    })
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
