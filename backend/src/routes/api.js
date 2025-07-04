const express = require("express");
const router = express.Router();
const coffeeController = require("../controllers/coffeeController");

router.get("/ingredients", coffeeController.getAllIngredients);

router.post("/build-coffee", coffeeController.buildCoffee);

module.exports = router;
