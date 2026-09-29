// =============================================================
// Drift & Co. — User Profile Page
// Shows the logged-in user's information (name, email, join
// date) and quick links to their orders and the cart.
// =============================================================
import { User, Mail, Calendar, ShoppingBag, Package, LogOut, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, orders, logout, wishlistCount } = useApp();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
        <p className="mt-2 text-gray-500">You need to be logged in to view your profile.</p>
        <button
          onClick={() => onNavigate("/login")}
          className="mt-4 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
          {user.role}
        </span>
      </div>

      {/* Account details */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">Email</span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-900">{user.email}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide">Member Since</span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-900">{user.joined}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button onClick={() => onNavigate("/orders")}
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Package size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">My Orders</p>
            <p className="text-xs text-gray-500">{userOrders.length} orders placed</p>
          </div>
        </button>
        <button onClick={() => onNavigate("/wishlist")}
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <Heart size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Wishlist</p>
            <p className="text-xs text-gray-500">{wishlistCount} items saved</p>
          </div>
        </button>
        <button onClick={() => onNavigate("/cart")}
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <ShoppingBag size={20} className="text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">My Cart</p>
            <p className="text-xs text-gray-500">View items and checkout</p>
          </div>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => { logout(); onNavigate("/"); }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
}
