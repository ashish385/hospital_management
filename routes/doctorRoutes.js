const express = require("express");
const router = express.Router();
const { createDoctor, getAllDoctors, updateDoctor } = require("../controllers/doctorController");
const {auth, isDoctor   } = require("../middlewares/authMiddleware");

// Routes add a doctor
router.post("/createDoctor", createDoctor);
router.get("/getAllDoctors", auth, getAllDoctors);
router.put("/updateDoctor", auth, isDoctor, updateDoctor);

module.exports = router;
