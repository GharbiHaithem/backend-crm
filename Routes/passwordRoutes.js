const express = require("express");
const router = express.Router();
const auth = require("../Controllers/ForgetPassword");

router.post("/forgotPassword", auth.forgotPassword);
// router.post("/resetPassword/:token", auth.resetPassword);
router.post("/resetPassword/:token", auth.resetPassword);
module.exports = router;
