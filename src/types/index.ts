// =============================================================
// Drift & Co. — Type Definitions
// These TypeScript interfaces define the shape of all data used
// across the app (products, cart, orders, users, reviews, etc.).
// Keeping them in one place makes the code easy to follow and
// re-use. When a FastAPI + MySQL backend is connected later, the
// JSON returned by the API should match these interfaces.
// =============================================================

export type Gender = "men" | "women" | "kids";

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number; // 1–5
  date: string; // ISO date
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  price: number; // in INR (₹)
  category: string; // e.g. "T-Shirts", "Kurtas"
  gender: Gender;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  rating: number; // average 0–5
  reviewCount: number;
  trending: boolean;
  newArrival: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  date: string; // ISO date
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plain for demo only — backend will hash
  role: "user" | "admin";
  joined: string;
}

export interface AdminStat {
  label: string;
  value: string;
  change: string;
}
