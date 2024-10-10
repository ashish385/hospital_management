const Doctor = require("../models/doctor");

// Create a new doctor
exports.createDoctor = async (req, res) => {
  console.log(req.body);

  const { contactNumber } = req.body;

  try {
    const existDoctor = await Doctor.findOne({ contactNumber: contactNumber });
    if (existDoctor) {
      return res.status(409).send("Doctor already exist!");
    }
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).send(newDoctor);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send(doctors);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send();
    }
    res.status(200).send(doctor);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).send();
    }
    res.status(200).send(doctor);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).send();
    }
    res.status(200).send(doctor);
  } catch (error) {
    res.status(500).send(error);
  }
};
