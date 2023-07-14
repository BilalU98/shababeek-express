const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.post("/signUp", user.signUp);

router.post("/addWorker", user.addWorker);

router.post("/changeLocation", user.changeLocation);

router.post("/signIn", user.signIn);

router.get("/getAll", user.getAllUsers);

router.post("/getAllWorkers", user.getAllWorkers);

router.post("/getOneWorker", user.getOneWorker);

router.patch("/updateProfile", user.updateProfile);

router.post("/rateWorker", user.rateWorker);

router.post("/getUserByToken", user.getUserByToken);

module.exports = router;
