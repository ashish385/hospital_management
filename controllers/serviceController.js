const Service = require("../models/service");


exports.createService = async(req,res) => {
    const { serviceName, amount, address } = req.body;
    if (!serviceName || !amount || !address) {
        return res.status(400).json({
            success: true,
            message:"All fields are required"
        })
    }

    try {
        const service = await Service.findOne({serviceName});
        console.log("service",service);
        
        if (service) {
            return res.status(400).json({
                success: true,
                message: "Service already exists"
            })
        }
        const newService = new Service({ serviceName, amount, address });
        await newService.save();
        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: newService
            })

    } catch (error) {
        res.status(500).json({ message: "Error creating service", error });
    }
}

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        if (!services) {
            return res.status(404).json({success:false, message: "No services found" });
        }
        res.status(200).json({
            success: true,
            message: "Services retrieved successfully",
            data: services
        })
    } catch (error) {
        res.status(500).json({ message: "Error retrieving services", error });
        }
}

exports.updateService = async (req, res)=> {
    const { serviceName, amount, address } = req.body;
    const id = req.params.id;   
    if (!serviceName || !amount || !address) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }
    try {
        const service = await Service.findByIdAndUpdate(id, { serviceName, amount, address }, {
            new: true
        }).exec();

        if (!service) {
            return res.status(404).json({success:false, message: "Service not found" });
        }
        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        })
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error });
    }

            
}

exports.getActiveServices = async (req, res) => {
  try {
    const activeServices = await Service.find({ isActive: true });

    if (activeServices.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No active services found" });
    }

    res.status(200).json({
      success: true,
      data: activeServices,
    });
  } catch (error) {
    console.error("Error getting active services:", error);
    res.status(500).json({ message: "Error getting active services", error });
  }
};

