const express = require("express");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { createPatient, getPatientByUHID, getAllPatient } = require("../controllers/patientController");
const router = express.Router();


router.post("/createPatient", auth, isAdmin, createPatient);
router.get("/getAllPatient", auth, getAllPatient);
router.get("/getPatientByUHID/:patientUHID", auth, getPatientByUHID);


module.exports = router;