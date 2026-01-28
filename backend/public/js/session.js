// Ensure a session ID exists
if (!localStorage.getItem("sessionId")) {
  localStorage.setItem(
    "sessionId",
    "sess_" + Math.random().toString(36).substr(2, 9),
  );
}
