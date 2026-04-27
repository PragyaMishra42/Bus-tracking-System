const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/* TOKEN */
const generateToken = (user) => {
return jwt.sign(
{
id: user._id,
email: user.email,
role: user.role
},
process.env.JWT_SECRET || "secretkey",
{ expiresIn: "7d" }
);
};

/* REGISTER */
const registerUser = async (req,res) => {
try {

const { name,email,password,role } = req.body;

if (!name || !email || !password) {
return res.status(400).json({
success:false,
message:"Please fill all fields"
});
}

const exist = await User.findOne({ email });

if (exist) {
return res.status(400).json({
success:false,
message:"Email already exists"
});
}

const hash = await bcrypt.hash(password,10);

const user = await User.create({
name,
email,
password: hash,
role: role || "student"
});

res.status(201).json({
success:true,
message:"Registration Successful",
token: generateToken(user),
role:user.role,
name:user.name,
user
});

} catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

/* LOGIN */
const loginUser = async (req,res) => {
try {

const { email,password } = req.body;

const user = await User.findOne({ email });

if (!user) {
return res.status(401).json({
success:false,
message:"Invalid email or password"
});
}

const match = await bcrypt.compare(password,user.password);

if (!match) {
return res.status(401).json({
success:false,
message:"Invalid email or password"
});
}

res.json({
success:true,
message:"Login Successful",
token: generateToken(user),
role:user.role,
name:user.name,
user
});

} catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

/* PROFILE */
const getUserProfile = async (req,res) => {

const user = await User.findById(req.user.id).select("-password");

res.json({
success:true,
user
});

};

/* USERS */
const getUsers = async (req,res) => {

const users = await User.find().select("-password");

res.json({
success:true,
users
});

};

/* DELETE */
const deleteUser = async (req,res) => {

await User.findByIdAndDelete(req.params.id);

res.json({
success:true,
message:"User Deleted"
});

};

module.exports = {
registerUser,
loginUser,
getUserProfile,
getUsers,
deleteUser
};