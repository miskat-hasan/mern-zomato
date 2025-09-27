const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

//* Food Partner Middleware
const authFoodPartnerMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please Login First.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

//* User Middleware
const authUserMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(decoded);

    const user = await userModel.findById(decoded.id);

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid Token",
    });
  }
};

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};
