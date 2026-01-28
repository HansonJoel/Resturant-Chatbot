const { processMessage } = require("../services/chat.service");

exports.chat = (req, res) => {
  const { sessionId, message } = req.body;
  const reply = processMessage(sessionId, message);
  res.json({ reply });
};
