const express = require("express");
const router = express.Router();
const payment = require("../controller/payment-controller");

router.route("/payment").post(payment);

module.exports = router;
