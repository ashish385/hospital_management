const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/doctor", require("./doctorRoutes"));
router.use("/patient", require("./patientRoutes"));
router.use("/service", require("./serviceRoutes"));
router.use("/procedure", require("./procedureRoutes"));
router.use("/opd", require("./opdRoutes"));

module.exports = router;
