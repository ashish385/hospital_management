const express = require("express");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { createProcedure, getAllProcedures, updateProcedure, getActiveProcedures, getDeactiveProcedures } = require("../controllers/procedureController");


const router = express.Router();

router.post("/createProcedure", auth, isAdmin, createProcedure);
router.get("/getAllProcedure", getAllProcedures);
router.put("/updateProcedure/:id", auth, isAdmin, updateProcedure);
router.get("/getActiveProcedure", auth, isAdmin, getActiveProcedures);
router.get("/getDeactiveProcedure", auth, isAdmin, getDeactiveProcedures);

module.exports = router;
