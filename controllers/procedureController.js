const Procedure = require("../models/procedure");

exports.createProcedure = async (req, res) => {
  const { procedureName, amount, address } = req.body;
  if (!procedureName || !amount || !address) {
    return res.status(400).json({
      success: true,
      message: "All fields are required",
    });
  }

  try {
    const procedure = await Procedure.findOne({ procedureName });
    console.log("procedure", procedure);

    if (procedure) {
      return res.status(400).json({
        success: true,
        message: "procedure already exists",
      });
    }
    const newprocedure = await Procedure.create({
      procedureName,
      amount,
      address,
    });

    res.status(201).json({
      success: true,
      message: "procedure created successfully",
      data: newprocedure,
    });
  } catch (error) {
    console.log("erreo",error);
    
    res.status(500).json({ message: "Error creating procedure", error });
  }
};

exports.getAllProcedures = async (req, res) => {
  try {
    const procedures = await Procedure.find();
    if (!procedures) {
      return res
        .status(404)
        .json({ success: false, message: "No procedures found" });
    }
    res.status(200).json({
      success: true,
      message: "procedures retrieved successfully",
      data: procedures,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving procedures", error });
  }
};

exports.updateProcedure = async (req, res) => {
  const { procedureName, amount, address } = req.body;
  const id = req.params.id;
  if (!procedureName || !amount || !address) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    const procedure = await Procedure.findByIdAndUpdate(
      id,
      { procedureName, amount, address },
      {
        new: true,
      }
    ).exec();

    if (!procedure) {
      return res
        .status(404)
        .json({ success: false, message: "procedure not found" });
    }
    res.status(200).json({
      success: true,
      message: "procedure updated successfully",
      data: procedure,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating procedure", error });
  }
};

exports.getActiveProcedures = async (req, res) => {
  try {
    const activeProcedures = await Procedure.find({ isActive: true });

    if (activeProcedures.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No active procedures found" });
    }

    res.status(200).json({
      success: true,
      data: activeProcedures,
    });
  } catch (error) {
    console.error("Error getting active procedures:", error);
    res.status(500).json({ message: "Error getting active procedures", error });
  }
};

exports.getDeactiveProcedures = async (req, res) => {
  try {
    const deactiveProcedures = await Procedure.find({ isActive: false });

    if (deactiveProcedures.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No active procedures found" });
    }

    res.status(200).json({
      success: true,
      data: deactiveProcedures,
    });
  } catch (error) {
    console.error("Error getting active procedures:", error);
    res.status(500).json({ message: "Error getting active procedures", error });
  }
};
