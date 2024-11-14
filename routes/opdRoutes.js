const express = require("express");
const { saveOPDBooking, getTodayOpdBooking, getOPDDetailsById, extendUnvisitedBookingsToNextDay, setOpdPatientVisitedByDoctor, updateBookingIfDoctorIsMissing, createServiceBilling } = require("../controllers/opdController");
const router = express.Router();

router.post("/saveOpdBooking", saveOPDBooking);
router.get("/todayOpdBooking", getTodayOpdBooking);
router.get("/getOpdDetailById/:opdBookingId", getOPDDetailsById);
router.put("/patientVisitedByDoctor/:opdBookingId",setOpdPatientVisitedByDoctor);
router.put("/extendUnvisitedBookingsToNextDay", extendUnvisitedBookingsToNextDay);
router.put("/updateBookingIfDoctorMissing/:bookingId", updateBookingIfDoctorIsMissing);
router.post("/createServiceBilling/:opdId", createServiceBilling);


module.exports = router;