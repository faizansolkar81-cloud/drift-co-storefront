// =============================================================
// Drift & Co. — My Orders Page
// Shows a list of the user's past orders with order ID,
// products, total amount (INR), order date, and order status.
// Each order can be expanded to see the items inside.
// =============================================================
import { useState } from "react";
import { Package, ChevronDown, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { OrderStatus } from "@/types";
import { formatINR } from "@/utils/format";

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

// Color-coded status badges
const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user, orders } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filter orders for the current user (or show all if admin)
  const userOrders = user
    ? user.role === "admin"
      ? orders
      : orders.filter((o) => o.userId === user.id)
    : [];

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
        <p className="mt-2 text-gray-500">You need to be logged in to view your orders.</p>
        <button onClick={() => onNavigate("/login")}
          className="mt-4 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white">
          Go to Login
        </button>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">No orders yet</h1>
        <p className="mt-2 text-gray-500">When you place an order, it will appear here.</p>
        <button onClick={() => onNavigate("/men")}
          className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="mt-1 text-gray-500">{userOrders.length} order(s) placed</p>

      <div className="mt-8 space-y-4">
        {userOrders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            {/* Order header */}
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="flex w-full items-center justify-between p-5 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Package size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-400">Placed on {order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <span className="text-sm font-bold text-gray-900">{formatINR(order.total)}</span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Expanded order details */}
            {expanded === order.id && (
              <div className="border-t border-gray-100 p-5">
                {/* Shipping info */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm">
                  <p className="font-semibold text-gray-900">Shipping To:</p>
                  <p className="text-gray-600">{order.customer.name} · {order.customer.phone}</p>
                  <p className="text-gray-500">
                    {order.customer.address}, {order.customer.city}, {order.customer.state} — {order.customer.pincode}, {order.customer.country}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.size} · {item.color} · Qty {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-bold text-gray-900">Order Total</span>
                  <span className="text-sm font-bold text-gray-900">{formatINR(order.total)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
