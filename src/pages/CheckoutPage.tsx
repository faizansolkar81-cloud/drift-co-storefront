// =============================================================
// Drift & Co. — Checkout Page
// Collects customer information, shipping address (with Indian
// state and pincode fields), shows an order summary, and has
// a "Place Order" button. On submit, the order is saved to
// context/localStorage and the user sees a confirmation.
// All prices in INR (₹).
// =============================================================
import { useState } from "react";
import { CheckCircle2, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/utils/format";

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, cartSubtotal, placeOrder, user } = useApp();
  const [placed, setPlaced] = useState<string | null>(null);

  // Form state for customer + shipping info (Indian address format)
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    country: "India",
  });

  const shipping = cartSubtotal > 2000 ? 0 : 99;
  const tax = Math.round(cartSubtotal * 0.05);
  const total = cartSubtotal + shipping + tax;

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder(form);
    if (order) {
      setPlaced(order.id);
    }
  };

  // ---- Order confirmation screen ----
  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="mt-2 text-gray-500">
          Thank you for your purchase. Your order ID is{" "}
          <span className="font-semibold text-gray-900">{placed}</span>.
        </p>
        <p className="mt-1 text-sm text-gray-500">A confirmation email has been sent to {form.email}.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => onNavigate("/orders")}
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View My Orders
          </button>
          <button
            onClick={() => onNavigate("/")}
            className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ---- Empty cart guard ----
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some products before checking out.</p>
        <button
          onClick={() => onNavigate("/men")}
          className="mt-4 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ---- Left: forms ---- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer information */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">1</span>
              Customer Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" required pattern="[0-9]{10}" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                <select value={form.country} onChange={(e) => update("country", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">2</span>
              Shipping Address
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Street Address</label>
                <input type="text" required value={form.address} onChange={(e) => update("address", e.target.value)}
                  placeholder="Flat / House No, Street, Area"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                <input type="text" required value={form.city} onChange={(e) => update("city", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                <select value={form.state} onChange={(e) => update("state", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400">
                  {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Pincode</label>
                <input type="text" required pattern="[0-9]{6}" value={form.pincode} onChange={(e) => update("pincode", e.target.value)}
                  placeholder="6-digit pincode"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400" />
              </div>
            </div>
          </div>

          {/* Payment method (UI only) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">3</span>
              Payment Method
            </h2>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <CreditCard size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">Cash on Delivery (demo mode)</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={14} /> Your information is safe and encrypted.
            </div>
          </div>
        </div>

        {/* ---- Right: order summary ---- */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            {/* Items */}
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="h-14 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.selectedSize} · {item.selectedColor} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST (5%)</span>
                <span className="font-semibold">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">{formatINR(total)}</span>
              </div>
            </div>

            {/* Place order */}
            <button type="submit"
              className="mt-6 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800">
              Place Order
            </button>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Truck size={14} /> Free shipping on orders over {formatINR(2000)}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
