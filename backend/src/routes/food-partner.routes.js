const express = require("express");
const { authFoodPartnerMiddleware } = require("../middlewares/auth.middleware");
const { getFoodPartner } = require("../controllers/food-partner.controller");

const router = express.Router();

router.get("/:id", authFoodPartnerMiddleware, getFoodPartner);

module.exports = router;
