const API_URL = "http://localhost:5000/api/chat";

async function sendToServer(message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: localStorage.getItem("sessionId"),
      message,
    }),
  });
  return res.json();
}
