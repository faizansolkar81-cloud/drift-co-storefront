// =============================================================
// Drift & Co. — Main App Component
// This is the root of the application. It wraps everything in
// the AppProvider (for global state) and uses a simple hash
// router to switch between pages. The router reads the URL
// hash (e.g. #/men) and renders the matching page.
// =============================================================
import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { useHashRoute } from "@/hooks/useHashRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import ProductListingPage from "@/pages/ProductListingPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import AdminDashboard from "@/pages/AdminDashboard";
import WishlistPage from "@/pages/WishlistPage";
import type { Product, Gender } from "@/types";

function AppContent() {
  const { path, navigate } = useHashRoute();
  const { allProducts } = useApp();

  // Navigate to product details page
  const viewProduct = (product: Product) => navigate(`/product/${product.id}`);

  // ---- Route matching ----
  // The path is the part after "#" in the URL (e.g. "/men", "/product/5")
  const renderPage = () => {
    // Home
    if (path === "/") return <HomePage onNavigate={navigate} onViewProduct={viewProduct} />;

    // Category pages (Men / Women / Kids)
    if (path === "/men") return <ProductListingPage gender="men" title="Men's Collection" subtitle="Sharp, modern, and built for everyday style" onNavigate={navigate} onViewProduct={viewProduct} />;
    if (path === "/women") return <ProductListingPage gender="women" title="Women's Collection" subtitle="Elegant, bold, and effortlessly timeless" onNavigate={navigate} onViewProduct={viewProduct} />;
    if (path === "/kids") return <ProductListingPage gender="kids" title="Kids' Collection" subtitle="Playful, comfortable, and adorable" onNavigate={navigate} onViewProduct={viewProduct} />;

    // Search results
    if (path.startsWith("/search")) {
      const query = decodeURIComponent(path.split("?q=")[1] || "");
      return <ProductListingPage searchQuery={query} title="Search Results" subtitle={`Showing results for "${query}"`} onNavigate={navigate} onViewProduct={viewProduct} />;
    }

    // Product details
    if (path.startsWith("/product/")) {
      const id = Number(path.split("/")[2]);
      const product = allProducts.find((p) => p.id === id);
      if (product) return <ProductDetailsPage product={product} onNavigate={navigate} />;
      return <NotFound onNavigate={navigate} />;
    }

    // Authentication
    if (path === "/login") return <AuthPage mode="login" onNavigate={navigate} />;
    if (path === "/register") return <AuthPage mode="register" onNavigate={navigate} />;

    // User profile
    if (path === "/profile") return <ProfilePage onNavigate={navigate} />;

    // Wishlist
    if (path === "/wishlist") return <WishlistPage onNavigate={navigate} onViewProduct={viewProduct} />;

    // Cart & checkout
    if (path === "/cart") return <CartPage onNavigate={navigate} />;
    if (path === "/checkout") return <CheckoutPage onNavigate={navigate} />;

    // Orders
    if (path === "/orders") return <OrdersPage onNavigate={navigate} />;

    // Admin dashboard
    if (path === "/admin") return <AdminDashboard onNavigate={navigate} />;

    // Fallback
    return <NotFound onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onNavigate={navigate} currentPath={path} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

// Simple 404 component
function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => onNavigate("/")}
        className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
      >
        Back to Home
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
