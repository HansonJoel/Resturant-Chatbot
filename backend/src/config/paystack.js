const dotenv = require("dotenv");

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

module.exports = {
  PAYSTACK_SECRET_KEY,
};
