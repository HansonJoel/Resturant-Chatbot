const menu = require("../data/menu");

exports.addItem = (session, itemId) => {
  const item = menu.find((m) => m.id === itemId);
  if (!item) return false;

  session.currentOrder.push({ ...item, qty: 1 });
  return true;
};

exports.calculateTotal = (order) => {
  return order.reduce((sum, item) => sum + item.price * item.qty, 0);
};
