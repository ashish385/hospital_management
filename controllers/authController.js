const User = require("../models/user");
const { validateFields } = require("../utils/validateFields");
const jwt = require("jsonwebtoken")
require("dotenv").config();


// Register user
 exports.registerUser =  async (req, res) => {

   const { fullName, email, password, accountType } = req.body;
   console.log(req.body);
   

   const requiredFields = { fullName, email, accountType };
  
   try {
     // Use the validateFields function to get missing fields
     const missingFields = validateFields(requiredFields);
     // Check if there are any missing fields
     if (missingFields.length > 0) {
       return res.status(400).json({
         message: `The following fields are required: ${missingFields.join(
           ", "
         )}`,
       });
     }

     // Check if user already exists
     let existingUser = await User.findOne({ email });
     console.log("existingUser", existingUser);
     

     if (existingUser)
       return res.status(400).json({ message: "User already exists" });
     if (accountType !== "admin")
       return res.status(400).json({ message: "Invalid account type!" });
     console.log("accountType", accountType);
     // Create a new user
     const newUser = new User({ fullName, email, password, accountType });
     await newUser.save();

     const userData = {
       fullName: newUser.fullName,
       email: newUser.email,
       accountType:newUser.accountType
     }
     // Return a success message
     res.status(200).json({
       success: true,
       message: "User added successfully!",
       data:userData
     })
   } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
   }
};
 
// Login user
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) return res.status(400).json({
    message: `All fields are required!`,
  });
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).json({ message: "User not found" });

    const correctPassword = await user.matchPassword(password);  
    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  
    // Return JWT token
    const token = jwt.sign(
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const data = {
      token: token,
      email: user.email,
      accountType:user.accountType
    }
    res.status(200).json({ 
      success: true,
      data:data
     });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Forgot password
exports.forgotPassword = async(req,res)=>{
  const { id } = req.user;
  const {  newPassword } = req.body;

  if (!newPassword) return res.status(400).json({
    success: false,
    message:"New password required"
  })
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ success: false, message: "User not found" })
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: "Password updated successfully" });
    
  } catch (error) {
     res.status(500).json({ message: "Error creating new password", error });
  }
}

