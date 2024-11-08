const express = require("express");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { getPatientByUHID, getAllPatient, generateUHID } = require("../controllers/patientController");
const router = express.Router();


router.post("/generateUHID", auth, isAdmin, generateUHID);
router.get("/getAllPatient", auth, getAllPatient);
router.get("/getPatientByUHID/:patientUHID", auth, getPatientByUHID);


module.exports = router;