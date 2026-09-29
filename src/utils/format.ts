// =============================================================
// Drift & Co. — Currency Formatter
// Formats a number as Indian Rupees (₹) with the Indian
// numbering system (e.g. ₹1,299). Used across all product
// cards, cart, checkout, and admin pages.
// =============================================================

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
