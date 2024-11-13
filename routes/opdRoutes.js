const express = require("express");
const { saveOPDBooking, getTodayOpdBooking, getOPDDetailsById, extendUnvisitedBookingsToNextDay } = require("../controllers/opdController");
const router = express.Router();

router.post("/saveOpdBooking", saveOPDBooking);
router.get("/todayOpdBooking", getTodayOpdBooking);
router.get("/getOpdDetailById/:opdBookingId", getOPDDetailsById);
router.put("/extendUnvisitedBookingsToNextDay",extendUnvisitedBookingsToNextDay);

module.exports = router;