const express = require("express");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const {
  createService,
  getAllServices,
  updateService,
  getActiveServices,
  getDeactiveServices,
} = require("../controllers/serviceController");

const router = express.Router();

router.post("/createService", auth, isAdmin, createService);
router.get("/getAllServices", getAllServices);
router.put("/updateService/:id", auth, isAdmin, updateService);
router.get("/getActiveServices", auth, isAdmin, getActiveServices);
router.get("/getDeactiveServices", auth, isAdmin, getDeactiveServices);

module.exports = router;
