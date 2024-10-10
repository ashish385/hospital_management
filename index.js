// app.js
const express = require("express");
const database = require("./config/database")
const dotenv = require("dotenv");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();
database.connect();

const app = express();
const port = process.env.PORT || 8800;


app.use(express.json()); 

// Routes
app.use("/api/v1/doctor", doctorRoutes);

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
