const sessions = require("../data/sessions");
const { initPayment } = require("../services/paystack.service");

exports.pay = async (req, res) => {
  const { sessionId } = req.body;

  console.log("PAYMENT REQUEST SESSION ID:", sessionId);
  const session = sessions[sessionId];
  console.log("SESSION DATA AT PAYMENT TIME:", session);

  if (!session) {
    return res.json({ error: "Invalid session. Session not found." });
  }

  const result = await initPayment(session);
  res.json(result);
};
