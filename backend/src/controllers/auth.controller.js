const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodPartner.model");

//* Register User
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_TOKEN
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User register successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
};

//* LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "invalid email or password",
    });
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return res.status(400).json({
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_TOKEN
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User successfully logged in.",
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

//* Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
};

//* FoodPartner Register
const registerFoodPartner = async (req, res) => {
  const { name, email, password } = req.body;

  const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

  if (isAccountAlreadyExists) {
    return res.status(400).json({
      message: "Food Partner already exists. Please login",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_TOKEN
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "Food Partner Register Successfully.",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
    },
  });
};

//* Food Partner Login
const loginFoodPartner = async (req, res) => {
  const { email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({ email });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid email or password.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    {
      id: foodPartner._id,
    },
    process.env.JWT_TOKEN
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Food Partner Logged in successfully.",
    foodPartner: {
      _id: foodPartner._id,
      name: foodPartner.name,
      email: foodPartner.email,
    },
  });
};

//* Food Partner Logout
const logoutFoodPartner = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    message: "Food Partner logged out successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
