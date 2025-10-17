const foodModel = require("../models/food.model");

const foodPartnerModel = require("../models/foodPartner.model");

const getFoodPartner = async (req, res) => {
  const foodPartnerId = req.params.id;

  if (!foodPartnerId) {
    return res.status(400).json({
      success: false,
      message: "Food Partner ID is required.",
    });
  }

  const foodPartner = await foodPartnerModel.findById(foodPartnerId);

  if (!foodPartner) {
    return res.status(404).json({
      success: false,
      message: "Food Partner not found.",
    });
  }

  const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

  res.status(200).json({
    success: true,
    message: "Food Partner fetched successfully.",
    // foodPartner,
    // foodItems: foodItemsByFoodPartner,
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems: foodItemsByFoodPartner,
    },
  });
};

module.exports = {
  getFoodPartner,
};
