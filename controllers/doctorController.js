
const jwt = require("jsonwebtoken");
const { validateFields } = require("../utils/validateFields");
const User = require("../models/user");
const Doctor = require("../models/doctor");
require("dotenv").config();

// Register user
exports.createDoctor = async (req, res) => {
  const {
    fullName,
    email,
    contactNumber,
    accountType,
    speciality,
    degree,
    opConsultationFee,
    consultationDays,
    feeConsultationVisits,
    ipVisitFee,
    casualtyFee,
    icuFee,
    experience,
    generalFee,
    about,
  } = req.body;

  const requiredFields = {
    fullName,
    email,
    password: contactNumber,
    contactNumber,
    accountType,
    speciality,
    degree,
    opConsultationFee,
    consultationDays,
    feeConsultationVisits,
    ipVisitFee,
    casualtyFee,
    icuFee,
    experience,
    generalFee,
    about,
  };

  // Use the validateFields function to get missing fields
  const missingFields = validateFields(requiredFields);
  // Check if there are any missing fields
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The following fields are required: ${missingFields.join(", ")}`,
    });
  }
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create specific user by accountType
    let newUser;
    switch (accountType) {
      case "doctor":
        newUser = new Doctor(requiredFields);
        break;
      default:
        return res.status(400).json({ message: "Invalid account type" });
    }
    //  JWT_SECRET;
    await newUser.save();
    console.log("newuser", newUser);

    //  Return JWT token after registration
    const token = jwt.sign(
      { id: newUser._id, accountType: newUser.accountType },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving doctors", error });
  }
};

exports.updateDoctor = async (req, res) => {
  const {
    fullName,
    contactNumber,
  } = req.body;
  
  const { id, accountType } = req.user;
  

  try {
   
    let userProfile = await Doctor.findById(id).select("-password");
    // console.log("user profile",userProfile);
    
    if (!userProfile)
      return res.status(400).json({ message: "User not exists" });
    
    if (accountType !== "doctor")
      return res.status(400).json({ message: "Invalid account type" });

    userProfile.contactNumber = contactNumber;
    userProfile.fullName = fullName;
    
    await userProfile.save();

    res.status(201).json({
      success: true,
      message:"doctor profile update successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

exports.updateDoctorByAdmin = async (req, res) => {
  const {
    fullName,
    contactNumber,
    speciality,
    degree,
    opConsultationFee,
    consultationDays,
    feeConsultationVisits,
    ipVisitFee,
    casualtyFee,
    icuFee,
    experience,
    generalFee,
    about,
  } = req.body;

  const doctorId = req.params.id;

   const requiredFields = {
     fullName,
     contactNumber,
     speciality,
     degree,
     opConsultationFee,
     consultationDays,
     feeConsultationVisits,
     ipVisitFee,
     casualtyFee,
     icuFee,
     experience,
     generalFee,
     about,
   };

   const missingFields = validateFields(requiredFields);

   if (missingFields.length > 0) {
     return res.status(400).json({
       message: `The following fields are required: ${missingFields.join(
         ", "
       )}`,
     });
   }


  try {
  
    let doctorProfile = await Doctor.findById(doctorId).select("-password");

    if (!doctorProfile)
      return res.status(400).json({ message: "Doctor not exists" });

    doctorProfile.fullName = fullName;
    doctorProfile.contactNumber = contactNumber;
    doctorProfile.speciality = speciality;
    doctorProfile.degree = degree;
    doctorProfile.opConsultationFee = opConsultationFee;
    doctorProfile.consultationDays = consultationDays;
    doctorProfile.feeConsultationVisits = feeConsultationVisits;
    doctorProfile.ipVisitFee = ipVisitFee;
    doctorProfile.casualtyFee = casualtyFee;
    doctorProfile.icuFee = icuFee;
    doctorProfile.experience = experience;
    doctorProfile.generalFee = generalFee;
    doctorProfile.about = about;

    await doctorProfile.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile update successfully!",
      data:doctorProfile
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
