const express = require("express");
const router = express.Router();
const category = require("../controllers/category.controller");

router.get("/getAll", category.getAllCategories);
router.post("/addOne", category.addOneCategory);
router.patch("/updateCategory", category.updateCategory);

router.delete("/removeOne/:id", category.removeOneCategory);

module.exports = router;
