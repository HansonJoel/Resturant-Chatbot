const { PAYSTACK_SECRET_KEY } = require("../config/paystack");

/**
 * Initialize Paystack payment for last order
 */
exports.initPayment = async (session) => {
  console.log("💳 INIT PAYMENT CALLED");
  console.log("🧾 LAST ORDER:", session.lastOrder);

  if (!session.lastOrder || !session.lastOrder.total) {
    return { error: "No order to pay for" };
  }

  const amountInKobo = session.lastOrder.total * 100;

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@paystack.com",
          amount: amountInKobo,
          metadata: {
            orderId: session.lastOrder.orderId,
          },
          callback_url: "http://localhost:5000/payment-success.html",
        }),
      },
    );

    const data = await response.json();

    console.log("📡 PAYSTACK RESPONSE:", data);

    if (data.status === true && data.data.authorization_url) {
      return { paymentUrl: data.data.authorization_url };
    }

    return {
      error: data.message || "Paystack initialization failed",
    };
  } catch (error) {
    console.error("❌ PAYSTACK SERVICE ERROR:", error);
    return { error: "Server error initializing payment" };
  }
};
