const {Patient} = require("../models/patient")
const User = require("../models/user");
const { validateFields, getNextUHID } = require("../utils/validateFields");

exports.createPatient = async (req, res) => {
  const { fullName, email, accountType, age, gender, contactNumber, address } =
    req.body;

  const requiredFields = {
    fullName,
    email,
    password: contactNumber, // Ensure this field is correct based on your schema
    accountType,
    age,
    gender,
    contactNumber,
    address,
  };

  const missingFields = validateFields(requiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The following fields are required: ${missingFields.join(", ")}`,
    });
  }

  try {
    let existingPatient = await Patient.findOne({ email }); // Check against Patient model

    if (existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new patient instance
    const newPatient = new Patient({...requiredFields,patientUHID:""});
    console.log("Creating new patient:", newPatient); // Log the patient data

    await newPatient.save(); // This will trigger the pre-save hook

    const userData = {
      fullName: newPatient.fullName,
      email: newPatient.email,
      accountType: newPatient.accountType,
      patientUHID: newPatient.patientUHID,
    };

    // Return a success message
    res.status(200).json({
      success: true,
      message: "Patient added successfully!",
      data: userData,
    });
  } catch (error) {
    console.error("Error creating patient:", error); 
    res.status(500).json({ message: "Error creating patient", error });
  }
};

