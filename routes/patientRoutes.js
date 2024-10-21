const express = require("express");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { createPatient } = require("../controllers/patientController");
const router = express.Router();


router.post("/createPatient", auth, isAdmin, createPatient);


module.exports = router;