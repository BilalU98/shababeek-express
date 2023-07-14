const express = require("express");
const router = express.Router();
const plan = require("../controllers/plan.controller");

router.get("/details", plan.details);
router.patch("/change", plan.change);

module.exports = router;
