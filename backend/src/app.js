const path = require("path");
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chat.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve API routes
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public")));

module.exports = app;
