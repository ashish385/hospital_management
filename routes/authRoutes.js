const express = require("express");
const router = express.Router();
const { registerUser, userLogin, updateProfileImage } = require("../controllers/authController");
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { updateDoctorByAdmin } = require("../controllers/doctorController");

// Routes add a doctor
router.post("/", registerUser);
router.post("/login", userLogin);
router.put("/updateDoctorProfile/:id",auth,isAdmin,updateDoctorByAdmin)
router.put("/updateUserProfileImage/:id", auth, updateProfileImage);


module.exports = router;
