// =============================================================
// Drift & Co. — Global App Context (Store)
// Manages all client-side state: cart, wishlist, auth, orders,
// reviews, and product management. Attempts to use the FastAPI
// backend when available, and falls back to localStorage so the
// frontend still works without the backend running.
// =============================================================
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Order, User, OrderStatus, Review, Product } from "@/types";
import { products, seedReviews } from "@/data/products";
import { api, setToken, clearToken, getToken, type ApiProduct, type ApiOrder, type ApiReview } from "@/utils/api";

interface AppContextValue {
  // ---- Cart ----
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // ---- Wishlist ----
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;

  // ---- Auth ----
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;

  // ---- Orders ----
  orders: Order[];
  placeOrder: (customer: Order["customer"]) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // ---- Reviews ----
  reviews: Review[];
  addReview: (review: Review) => void;
  getReviewsForProduct: (productId: number) => Review[];

  // ---- Admin: product management ----
  allProducts: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: number) => void;

  // ---- Admin: user management ----
  deleteUser: (id: string) => void;

  // ---- API status ----
  apiConnected: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

// ---- localStorage helpers ----
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Seed users for localStorage fallback (when backend is offline)
const seedUsers: User[] = [
  { id: "admin-001", name: "Admin", email: "admin@driftandco.com", password: "admin123", role: "admin", joined: "2026-01-01" },
  { id: "user-001", name: "Rahul Sharma", email: "rahul@example.com", password: "pass123", role: "user", joined: "2026-06-15" },
  { id: "user-002", name: "Priya Patel", email: "priya@example.com", password: "pass123", role: "user", joined: "2026-07-20" },
  { id: "user-003", name: "Arjun Mehta", email: "arjun@example.com", password: "pass123", role: "user", joined: "2026-08-10" },
];

// Seed orders for localStorage fallback
const seedOrders: Order[] = [
  {
    id: "ORD-2026-001",
    userId: "user-001",
    items: [
      { productId: 1, name: "Classic Cotton Round-Neck T-Shirt", price: 499, quantity: 2, size: "L", color: "Black", image: products[0].image },
      { productId: 8, name: "Slim-Fit Stretch Jeans", price: 1499, quantity: 1, size: "32", color: "Dark Blue", image: products[7].image },
    ],
    total: 2497,
    date: "2026-09-01",
    status: "Delivered",
    customer: { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", address: "12 MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", country: "India" },
  },
  {
    id: "ORD-2026-002",
    userId: "user-001",
    items: [{ productId: 4, name: "Genuine Leather Biker Jacket", price: 4999, quantity: 1, size: "L", color: "Black", image: products[3].image }],
    total: 4999,
    date: "2026-09-15",
    status: "Shipped",
    customer: { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", address: "12 MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", country: "India" },
  },
  {
    id: "ORD-2026-003",
    userId: "user-002",
    items: [{ productId: 10, name: "Banarasi Silk Saree", price: 3499, quantity: 1, size: "Free Size", color: "Red", image: products[9].image }],
    total: 3499,
    date: "2026-09-18",
    status: "Processing",
    customer: { name: "Priya Patel", email: "priya@example.com", phone: "9820012345", address: "45 Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050", country: "India" },
  },
];

// ---- Convert API product to frontend Product ----
function apiProductToLocal(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    gender: p.gender as Product["gender"],
    image: p.image,
    description: p.description,
    sizes: p.sizes,
    colors: p.colors,
    rating: p.rating,
    reviewCount: p.reviewCount,
    trending: p.trending,
    newArrival: p.newArrival,
    stock: p.stock,
  };
}

// ---- Convert API order to frontend Order ----
function apiOrderToLocal(o: ApiOrder): Order {
  return {
    id: o.id,
    userId: String(o.user_id),
    items: o.items.map((i) => ({
      productId: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      image: i.image,
    })),
    total: o.total,
    date: o.date,
    status: o.status as OrderStatus,
    customer: {
      name: o.customer_name,
      email: o.customer_email,
      phone: o.customer_phone,
      address: o.customer_address,
      city: o.customer_city,
      state: o.customer_state,
      pincode: o.customer_pincode,
      country: o.customer_country,
    },
  };
}

// ---- Convert API review to frontend Review ----
function apiReviewToLocal(r: ApiReview): Review {
  return {
    id: r.id,
    productId: r.product_id,
    author: r.author,
    rating: r.rating,
    date: r.date,
    comment: r.comment,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load("dc_cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() => load("dc_wishlist", []));
  const [user, setUser] = useState<User | null>(() => load("dc_user", null));
  const [users, setUsers] = useState<User[]>(() => load("dc_users", seedUsers));
  const [orders, setOrders] = useState<Order[]>(() => load("dc_orders", seedOrders));
  const [allProducts, setAllProducts] = useState<Product[]>(() => load("dc_products", products));
  const [reviews, setReviews] = useState<Review[]>(() => load("dc_reviews", seedReviews));
  const [apiConnected, setApiConnected] = useState(false);

  // Persist state to localStorage on every change
  useEffect(() => localStorage.setItem("dc_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("dc_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("dc_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("dc_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("dc_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("dc_products", JSON.stringify(allProducts)), [allProducts]);
  useEffect(() => localStorage.setItem("dc_reviews", JSON.stringify(reviews)), [reviews]);

  // ---- On mount: try to fetch products from the API ----
  useEffect(() => {
    api.products.list()
      .then((apiProducts) => {
        if (apiProducts.length > 0) {
          setAllProducts(apiProducts.map(apiProductToLocal));
          setApiConnected(true);
        }
      })
      .catch(() => {
        // Backend not running — keep using localStorage data
        setApiConnected(false);
      });
  }, []);

  // ---- When user logs in with a token, restore their session ----
  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      api.auth.getProfile()
        .then((profile) => {
          const restoredUser: User = {
            id: String(profile.id),
            name: profile.name,
            email: profile.email,
            password: "",
            role: profile.role as "user" | "admin",
            joined: profile.joined?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
          };
          setUser(restoredUser);
          setApiConnected(true);
        })
        .catch(() => {
          // Token expired or invalid
          clearToken();
        });
    }
  }, []);

  // ---- Cart actions ----
  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.product.id === item.product.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor,
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });

    // Also push to the API cart if logged in
    if (getToken()) {
      api.cart.addItem(item.product.id, item.quantity, item.selectedSize, item.selectedColor).catch(() => {});
    }
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, qty: number) => {
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, qty) } : item)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartSubtotal = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);

  // ---- Wishlist actions ----
  const toggleWishlist = useCallback((productId: number) =>
    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]), []);

  const isInWishlist = useCallback((productId: number) => wishlist.includes(productId), [wishlist]);
  const wishlistCount = wishlist.length;

  // ---- Auth actions ----
  const login = useCallback((email: string, password: string) => {
    // Try API login first
    let success = false;
    api.auth.login(email, password)
      .then((res) => {
        setToken(res.access_token);
        const apiUser: User = {
          id: String(res.user.id),
          name: res.user.name,
          email: res.user.email,
          password: "",
          role: res.user.role as "user" | "admin",
          joined: res.user.joined?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        };
        setUser(apiUser);
        setApiConnected(true);
        success = true;
      })
      .catch(() => {
        // Fall back to localStorage users
        const found = users.find((u) => u.email === email && u.password === password);
        if (found) {
          setUser(found);
          success = true;
        }
      });

    // Also check localStorage synchronously so the UI updates immediately
    if (!success) {
      const found = users.find((u) => u.email === email && u.password === password);
      if (found) {
        setUser(found);
        return true;
      }
    }
    return true; // Optimistic return — API will confirm or the fallback handles it
  }, [users]);

  const register = useCallback((name: string, email: string, password: string) => {
    // Try API registration first
    api.auth.register(name, email, password)
      .then((res) => {
        setToken(res.access_token);
        const apiUser: User = {
          id: String(res.user.id),
          name: res.user.name,
          email: res.user.email,
          password: "",
          role: res.user.role as "user" | "admin",
          joined: res.user.joined?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        };
        setUser(apiUser);
        setApiConnected(true);
      })
      .catch(() => {
        // Fall back to localStorage
        if (users.some((u) => u.email === email)) return;
        const newUser: User = { id: `user-${Date.now()}`, name, email, password, role: "user", joined: new Date().toISOString().slice(0, 10) };
        setUsers((prev) => [...prev, newUser]);
        setUser(newUser);
      });

    // Synchronous fallback check
    if (users.some((u) => u.email === email)) return false;
    const newUser: User = { id: `user-${Date.now()}`, name, email, password, role: "user", joined: new Date().toISOString().slice(0, 10) };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  // ---- Order actions ----
  const placeOrder = useCallback((customer: Order["customer"]) => {
    if (cart.length === 0) return null;

    // Try creating the order via the API
    if (getToken()) {
      api.orders.create({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_city: customer.city,
        customer_state: customer.state,
        customer_pincode: customer.pincode,
        customer_country: customer.country,
      })
        .then((apiOrder) => {
          setOrders((prev) => [apiOrderToLocal(apiOrder), ...prev]);
        })
        .catch(() => {
          // Fall back to localStorage
          const order: Order = {
            id: `ORD-${Date.now()}`,
            userId: user?.id ?? "guest",
            items: cart.map((c) => ({
              productId: c.product.id, name: c.product.name, price: c.product.price,
              quantity: c.quantity, size: c.selectedSize, color: c.selectedColor, image: c.product.image,
            })),
            total: cartSubtotal,
            date: new Date().toISOString().slice(0, 10),
            status: "Pending",
            customer,
          };
          setOrders((prev) => [order, ...prev]);
        });
    }

    // Also save to localStorage immediately (optimistic)
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id ?? "guest",
      items: cart.map((c) => ({
        productId: c.product.id, name: c.product.name, price: c.product.price,
        quantity: c.quantity, size: c.selectedSize, color: c.selectedColor, image: c.product.image,
      })),
      total: cartSubtotal,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
      customer,
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  }, [cart, cartSubtotal, clearCart, user]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    // Also update via API
    if (getToken()) {
      api.admin.updateOrderStatus(orderId, status).catch(() => {});
    }
  }, []);

  // ---- Review actions ----
  const addReview = useCallback((review: Review) => {
    setReviews((prev) => [review, ...prev]);

    // Also submit to the API
    if (getToken()) {
      api.reviews.add(review.productId, review.author, review.rating, review.comment)
        .catch(() => {});
    }
  }, []);

  const getReviewsForProduct = useCallback((productId: number) => {
    return reviews.filter((r) => r.productId === productId);
  }, [reviews]);

  // ---- Admin: product CRUD ----
  const addProduct = useCallback((p: Product) => {
    setAllProducts((prev) => [...prev, p]);

    // Also create via API
    if (getToken()) {
      api.products.create({
        name: p.name, price: p.price, category: p.category, gender: p.gender,
        image: p.image, description: p.description, sizes: p.sizes, colors: p.colors,
        rating: p.rating, reviewCount: p.reviewCount, trending: p.trending,
        newArrival: p.newArrival, stock: p.stock,
      } as any).catch(() => {});
    }
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setAllProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));

    // Also update via API
    if (getToken()) {
      api.products.update(p.id, {
        name: p.name, price: p.price, category: p.category, gender: p.gender,
        image: p.image, description: p.description, sizes: p.sizes, colors: p.colors,
        rating: p.rating, reviewCount: p.reviewCount, trending: p.trending,
        newArrival: p.newArrival, stock: p.stock,
      } as any).catch(() => {});
    }
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setAllProducts((prev) => prev.filter((x) => x.id !== id));

    // Also delete via API
    if (getToken()) {
      api.products.delete(id).catch(() => {});
    }
  }, []);

  // ---- Admin: user management ----
  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));

    // Also delete via API (id may be numeric)
    if (getToken()) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        api.admin.deleteUser(numericId).catch(() => {});
      }
    }
  }, []);

  const value: AppContextValue = {
    cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartSubtotal,
    wishlist, toggleWishlist, isInWishlist, wishlistCount,
    user, users, login, register, logout, isAdmin,
    orders, placeOrder, updateOrderStatus,
    reviews, addReview, getReviewsForProduct,
    allProducts, addProduct, updateProduct, deleteProduct,
    deleteUser,
    apiConnected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook so components can access the store easily
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
