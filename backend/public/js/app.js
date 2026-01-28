document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const inputField = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  const CHAT_URL = "http://localhost:5000/api/chat";
  const PAYMENT_URL = "http://localhost:5000/api/payment";
  const sessionId = localStorage.getItem("sessionId");

  sendBtn.addEventListener("click", sendMessage);
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    addMessage("You", message);
    inputField.value = "";

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      });

      const data = await res.json();
      addMessage("Bot", data.reply);

      // Show Pay Now button if backend says so
      if (data.reply.toLowerCase().includes("proceed to payment")) {
        showPayNowButton();
      }
    } catch (err) {
      addMessage("Bot", "⚠️ Server error. Try again.");
    }
  }

  async function payNow() {
    try {
      const res = await fetch(PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        addMessage("Bot", `⚠️ Payment failed: ${data.error}`);
      }
    } catch (err) {
      addMessage("Bot", "⚠️ Payment failed. Server error.");
    }
  }

  function showPayNowButton() {
    if (document.getElementById("pay-btn")) return;

    const btn = document.createElement("button");
    btn.id = "pay-btn";
    btn.textContent = "💳 Pay Now";
    btn.onclick = payNow;

    messagesDiv.appendChild(btn);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function addMessage(sender, message) {
    const div = document.createElement("div");
    div.className = sender === "Bot" ? "bot-msg" : "user-msg";

    // Preserve line breaks from backend messages
    div.innerHTML = message.replace(/\n/g, "<br>");

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Show initial menu
  addMessage(
    "Bot",
    `Welcome to Eb Meals Restaurant <br>
1️⃣ Place an order<br>
99️⃣ Checkout order<br>
97️⃣ Current order<br>
0️⃣ Cancel order`,
  );
});
