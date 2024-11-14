const express = require("express");
const { saveOPDBooking, getTodayOpdBooking, getOPDDetailsById, extendUnvisitedBookingsToNextDay, setOpdPatientVisitedByDoctor } = require("../controllers/opdController");
const router = express.Router();

router.post("/saveOpdBooking", saveOPDBooking);
router.get("/todayOpdBooking", getTodayOpdBooking);
router.get("/getOpdDetailById/:opdBookingId", getOPDDetailsById);
router.put(
  "/patientVisitedByDoctor/:opdBookingId",
  setOpdPatientVisitedByDoctor
);
router.put("/extendUnvisitedBookingsToNextDay",extendUnvisitedBookingsToNextDay);

module.exports = router;