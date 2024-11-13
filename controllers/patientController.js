const { Patient } = require("../models/patient");
const Counter = require("../models/counter");
const { validateFields } = require("../utils/validateFields");

exports.generateUHID = async (req, res) => {
  const { fullName, email, age, gender, contactNumber, address } = req.body;

  const requiredFields = {
    fullName,
    email,
    contactNumber,
    password: contactNumber,
    accountType: "patient",
    age,
    gender,
    address,
  };

  const missingFields = validateFields(requiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `The following fields are required: ${missingFields.join(", ")}`,
    });
  }

  try {
    let existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new patient instance
    const newPatient = new Patient({
      ...requiredFields,
      patientUHID: Counter(),
    });
    console.log("Creating new patient:", newPatient);

    await newPatient.save();

    const userData = {
      fullName: newPatient.fullName,
      email: newPatient.email,
      contactNumber:newPatient.contactNumber,
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

exports.getAllPatient = async (req, res) => {
  try {
    const patientList = await Patient.find();

    if (!patientList) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient found",
      data: patientList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error to fetch all patient",
      error
    });
  }
};

exports.getPatientByUHID = async (req, res) => {
  const patientUHID = req.params.patientUHID;
  try {
    const patient = await Patient.findOne({ patientUHID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "Patient found",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Can't find patient by UHID",
      error
    });
  }
};
