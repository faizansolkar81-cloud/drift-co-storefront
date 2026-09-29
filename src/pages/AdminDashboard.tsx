// =============================================================
// Drift & Co. — Admin Dashboard
// A full admin panel with: admin login gate, dashboard
// statistics, manage users, manage products (add/edit/delete),
// manage orders (update status), and a reports section.
// All prices in INR (₹).
// =============================================================
import { useState } from "react";
import {
  LayoutDashboard, Users, Package, ShoppingBag, BarChart3, Plus, Pencil, Trash2,
  TrendingUp, DollarSign, ArrowLeft, X, Save,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Product, OrderStatus, Gender } from "@/types";
import { formatINR } from "@/utils/format";

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

type Tab = "dashboard" | "users" | "products" | "orders" | "reports";

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const {
    user, users, orders, allProducts, deleteUser, deleteProduct, addProduct, updateProduct, updateOrderStatus,
  } = useApp();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // ---- Admin login gate ----
  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
            <LayoutDashboard size={28} className="text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Admin Access Required</h1>
          <p className="mt-2 text-sm text-gray-500">
            Please log in with an admin account to access the dashboard.
          </p>
          <p className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-500">
            Admin: admin@driftandco.com / admin123
          </p>
          <button onClick={() => onNavigate("/login")}
            className="mt-4 w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ---- Dashboard statistics ----
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const stats = [
    { label: "Total Revenue", value: formatINR(totalRevenue), icon: DollarSign, change: "+12.5%", color: "bg-emerald-500" },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, change: "+8.2%", color: "bg-blue-500" },
    { label: "Products", value: allProducts.length.toString(), icon: Package, change: "+3", color: "bg-amber-500" },
    { label: "Users", value: users.length.toString(), icon: Users, change: "+5", color: "bg-indigo-500" },
  ];

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  const statusOptions: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const statusColors: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => onNavigate("/")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <ArrowLeft size={16} /> Back to Store
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-gray-100">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
              tab === t.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* ---- Dashboard tab ---- */}
      {tab === "dashboard" && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                    <TrendingUp size={12} /> {stat.change}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                    <th className="pb-2 font-semibold">Order ID</th>
                    <th className="pb-2 font-semibold">Customer</th>
                    <th className="pb-2 font-semibold">Date</th>
                    <th className="pb-2 font-semibold">Total</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-gray-50">
                      <td className="py-3 font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 text-gray-600">{order.customer.name}</td>
                      <td className="py-3 text-gray-500">{order.date}</td>
                      <td className="py-3 font-semibold text-gray-900">{formatINR(order.total)}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---- Products tab ---- */}
      {tab === "products" && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Manage Products ({allProducts.length})</h2>
            <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Gender</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-12 w-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{p.category}</td>
                    <td className="p-4 capitalize text-gray-600">{p.gender}</td>
                    <td className="p-4 font-semibold text-gray-900">{formatINR(p.price)}</td>
                    <td className="p-4 text-gray-600">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id); }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showProductForm && (
            <ProductFormModal product={editingProduct} onClose={() => setShowProductForm(false)}
              onSave={(p) => {
                if (editingProduct) updateProduct(p);
                else addProduct(p);
                setShowProductForm(false);
              }}
            />
          )}
        </div>
      )}

      {/* ---- Orders tab ---- */}
      {tab === "orders" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">Manage Orders ({orders.length})</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="p-4 font-medium text-gray-900">{order.id}</td>
                    <td className="p-4 text-gray-600">{order.customer.name}</td>
                    <td className="p-4 text-gray-500">{order.date}</td>
                    <td className="p-4 text-gray-600">{order.items.length}</td>
                    <td className="p-4 font-semibold text-gray-900">{formatINR(order.total)}</td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${statusColors[order.status]}`}>
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- Users tab ---- */}
      {tab === "users" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900">Manage Users ({users.length})</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50">
                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.role === "admin" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-4 text-gray-500">{u.joined}</td>
                    <td className="p-4">
                      {u.role !== "admin" && (
                        <button onClick={() => { if (confirm(`Delete user "${u.name}"?`)) deleteUser(u.id); }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- Reports tab ---- */}
      {tab === "reports" && (
        <div className="mt-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Reports & Analytics</h2>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Revenue by Gender</h3>
            <div className="mt-4 space-y-3">
              {(["men", "women", "kids"] as Gender[]).map((g) => {
                const rev = orders.reduce((sum, o) =>
                  sum + o.items.filter((i) => allProducts.find((p) => p.id === i.productId)?.gender === g)
                    .reduce((s, i) => s + i.price * i.quantity, 0), 0);
                const max = totalRevenue || 1;
                const pct = (rev / max) * 100;
                return (
                  <div key={g}>
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-gray-600">{g}</span>
                      <span className="font-semibold text-gray-900">{formatINR(rev)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-gray-900" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Orders by Status</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {statusOptions.map((s) => {
                const count = orders.filter((o) => o.status === s).length;
                return (
                  <div key={s} className="rounded-xl bg-gray-50 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{s}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Top Products by Orders</h3>
            <div className="mt-4 space-y-2">
              {allProducts
                .map((p) => ({
                  product: p,
                  count: orders.flatMap((o) => o.items).filter((i) => i.productId === p.id).reduce((s, i) => s + i.quantity, 0),
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map(({ product, count }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="h-10 w-9 rounded-lg object-cover" />
                    <span className="flex-1 text-sm text-gray-700">{product.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} sold</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// ProductFormModal — Add/Edit product form (used by admin)
// =============================================================
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<Product>(
    product ?? {
      id: Date.now(),
      name: "",
      price: 0,
      category: "T-Shirts",
      gender: "men",
      image: "https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      description: "",
      sizes: ["S", "M", "L"],
      colors: ["Black"],
      rating: 4.5,
      reviewCount: 0,
      trending: false,
      newArrival: true,
      stock: 10,
    },
  );

  const update = (key: keyof Product, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
              <input type="number" step="1" required value={form.price} onChange={(e) => update("price", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" required value={form.stock} onChange={(e) => update("stock", Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400">
                <option>T-Shirts</option><option>Shirts</option><option>Jeans</option>
                <option>Jackets</option><option>Sweaters</option><option>Kurtas</option>
                <option>Kurtis</option><option>Sarees</option><option>Tops</option>
                <option>Dresses</option><option>Ethnic Wear</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
              <select value={form.gender} onChange={(e) => update("gender", e.target.value as Gender)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400">
                <option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
            <input type="url" required value={form.image} onChange={(e) => update("image", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea required value={form.description} onChange={(e) => update("description", e.target.value)} rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
            <input type="text" value={form.sizes.join(", ")}
              onChange={(e) => update("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Colors (comma-separated)</label>
            <input type="text" value={form.colors.join(", ")}
              onChange={(e) => update("colors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.trending} onChange={(e) => update("trending", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300" />
              Trending
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.newArrival} onChange={(e) => update("newArrival", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300" />
              New Arrival
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800">
              <Save size={16} /> {isEdit ? "Update Product" : "Add Product"}
            </button>
            <button type="button" onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
