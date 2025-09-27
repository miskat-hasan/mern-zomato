const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
} = require("../controllers/auth.controller");

const router = express.Router();

//* user auth APIs
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);

//* Food Partner Auth APIs
router.post("/food-partner/register", registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);

module.exports = router;
