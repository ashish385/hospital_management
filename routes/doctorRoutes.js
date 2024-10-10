const express = require("express");
const router = express.Router();
const { createDoctor } = require("../controllers/doctorController");

// Routes add a doctor
router.post("/add-doctor", createDoctor);

module.exports = router;
