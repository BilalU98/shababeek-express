const express = require("express");
const router = express.Router();
const subscription = require("../controllers/subscription.controller");

router.get("/getAll", subscription.getAllSubscriptions);

router.post("/addOne", subscription.addOneSubscription);

router.delete("/removeOne/:id", subscription.removeOneSubscription);

module.exports = router;
