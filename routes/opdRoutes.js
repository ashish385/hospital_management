const express = require("express");
const { saveOPDBooking } = require("../controllers/opdController");
const router = express.Router();

router.post("/saveOpdBooking", saveOPDBooking);

module.exports = router;