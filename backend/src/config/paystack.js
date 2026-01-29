const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error(
    "❌ PAYSTACK_SECRET_KEY is missing from environment variables",
  );
}

module.exports = {
  PAYSTACK_SECRET_KEY,
};
