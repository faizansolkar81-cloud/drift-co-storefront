// =============================================================
// Drift & Co. — Navbar
// Top navigation bar with logo, nav links (Home, Men, Women,
// Kids), search bar, login/register link, and cart icon with
// a badge showing the number of items in the cart.
// =============================================================
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, LogOut, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function Navbar({ onNavigate, currentPath }: NavbarProps) {
  const { cartCount, wishlistCount, user, logout, isAdmin } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Submit search → navigate to /search?q=...
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Men", path: "/men" },
    { label: "Women", path: "/women" },
    { label: "Kids", path: "/kids" },
  ];

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center text-xl font-bold tracking-tight text-gray-900"
          >
            Drift <span className="text-gray-400 font-light">&</span> Co.
          </button>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  isActive(link.path)
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </form>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {/* User / Login */}
            {user ? (
              <div className="relative group">
                <button
                  onClick={() => onNavigate(isAdmin ? "/admin" : "/profile")}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </button>
                {/* Dropdown */}
                <div className="invisible absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <button
                    onClick={() => onNavigate(isAdmin ? "/admin" : "/profile")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {isAdmin ? "Admin Dashboard" : "My Profile"}
                  </button>
                  <button
                    onClick={() => onNavigate("/orders")}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { logout(); onNavigate("/"); }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate("/login")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <User size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Wishlist icon with badge */}
            <button
              onClick={() => onNavigate("/wishlist")}
              className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart icon with badge */}
            <button
              onClick={() => onNavigate("/cart")}
              className="relative rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { onNavigate(link.path); setMobileOpen(false); }}
                  className={`px-4 py-2.5 text-left text-sm font-medium rounded-lg transition ${
                    isActive(link.path) ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
