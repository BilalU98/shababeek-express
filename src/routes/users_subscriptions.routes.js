const express = require("express");
const router = express.Router();
const users_subscrioptions = require("../controllers/users_subscriptions.controller");

router.get("/getAll", users_subscrioptions.getAllActions);
router.post("/addOne", users_subscrioptions.addOneAction);

module.exports = router;
