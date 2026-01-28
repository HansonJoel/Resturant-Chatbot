const menu = require("../data/menu");
const sessions = require("../data/sessions");
const { generateId } = require("../utils/generateId");
const { calculateTotal } = require("./order.service");

// Main function to process chatbot messages

exports.processMessage = (sessionId, message) => {
  // Create session if it doesn't exist
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      id: sessionId,
      currentOrder: [],
      lastOrder: null,
      state: "IDLE", // IDLE, ORDERING
    };
  }

  const session = sessions[sessionId];

  // ORDERING

  if (session.state === "ORDERING") {
    // Special commands first
    if (message === "99") {
      return checkout(session);
    }

    if (message === "0") {
      session.currentOrder = [];
      session.state = "IDLE";
      return "❌ Order cancelled.\n\n1️⃣ Place new order\n97️⃣ Current order";
    }

    if (message === "97") {
      return showCurrentOrder(session);
    }

    // Try adding item by number that is not on the item list
    const itemId = parseInt(message);
    const addedItem = menu.find((m) => m.id === itemId);

    if (!addedItem) {
      return "⚠️ Invalid menu option. Please choose a valid item number.";
    }

    // Add item
    session.currentOrder.push({ ...addedItem, qty: 1 });

    // Return confirmation + menu + options
    return (
      `✅ ${addedItem.name} – ₦${addedItem.price} added.\n\n` +
      `${showMenu()}\n` +
      `99️⃣ Checkout order\n97️⃣ Current order\n0️⃣ Cancel order`
    );
  }

  // IDLE STATE (MAIN MENU)
  switch (message) {
    case "1":
      session.state = "ORDERING";
      return showMenu();
    case "97":
      return showCurrentOrder(session);
    case "99":
      return " No order to place.";
    case "0":
      return "No active order to cancel.";
    default:
      return mainMenu();
  }
};

// Main menu text
const mainMenu = () => `
Welcome to Eb Meals Restaurant 

1️⃣ Place an order
99️⃣ Checkout order
97️⃣ Current order
0️⃣ Cancel order
`;

//Show menu items
const showMenu = () => {
  let text = "Menu:\n";
  menu.forEach((item) => {
    text += `${item.id}️⃣ ${item.name} – ₦${item.price}\n`;
  });
  return text;
};

/**
 * Show current order
 */
const showCurrentOrder = (session) => {
  if (!session.currentOrder.length) return "🛒 No current order.";

  let text = "🛒 Current Order:\n";
  session.currentOrder.forEach((i, idx) => {
    text += `${idx + 1}. ${i.name} – ₦${i.price}\n`;
  });
  text += `\nTotal: ₦${calculateTotal(session.currentOrder)}\n`;
  text += `\nSelect an option:\n1️⃣ Place another item\n99️⃣ Checkout order\n0️⃣ Cancel order`;
  return text;
};

/**
 * Checkout current order
 */
const checkout = (session) => {
  if (!session.currentOrder.length) return "⚠️ No order to place.";

  const total = calculateTotal(session.currentOrder);
  const orderId = generateId();

  const order = {
    orderId,
    items: session.currentOrder,
    total,
    status: "pending", // this will update to "paid" after payment
  };

  session.lastOrder = order;
  session.currentOrder = [];
  session.state = "IDLE";

  return `💳 Order created!
Total: ₦${total}

Proceed to payment.`;
};
