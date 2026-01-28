const express = require("express");
const router = express.Router();
const { pay } = require("../controllers/payment.controller");

router.post("/", pay);
module.exports = router;
