const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/signUp", auth.signUp);
router.post("/signIn", auth.signIn);
router.get("/getAll", auth.getAllUsers);

module.exports = router;
