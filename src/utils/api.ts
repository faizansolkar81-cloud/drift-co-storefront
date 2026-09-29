// =============================================================
// Drift & Co. — API Client
// A thin wrapper around fetch() that talks to the FastAPI backend.
// All calls return parsed JSON or throw an Error with the API's
// error message. The base URL defaults to localhost:8000 but can
// be overridden with VITE_API_URL in the .env file.
// =============================================================

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

// ---- Token management ----
// The JWT token is stored in localStorage after login.
const TOKEN_KEY = "dc_api_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// ---- Core fetch wrapper ----
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach the auth token if available
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.detail) {
          message = typeof errorBody.detail === "string"
            ? errorBody.detail
            : JSON.stringify(errorBody.detail);
        }
      } catch {
        // Response wasn't JSON — use the default message
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out while contacting the server.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---- Exported API methods grouped by domain ----

export const api = {
  // ---- Auth ----
  auth: {
    register: (name: string, email: string, password: string) =>
      apiFetch<{ access_token: string; user: ApiUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      apiFetch<{ access_token: string; user: ApiUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    getProfile: () =>
      apiFetch<ApiUser>("/api/auth/profile"),
  },

  // ---- Products ----
  products: {
    list: (params?: Record<string, string | number | undefined>) => {
      const query = new URLSearchParams();
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== "") query.set(key, String(value));
        }
      }
      const qs = query.toString();
      return apiFetch<ApiProduct[]>(`/api/products${qs ? `?${qs}` : ""}`);
    },

    get: (id: number) =>
      apiFetch<ApiProduct>(`/api/products/${id}`),

    create: (product: Partial<ApiProduct>) =>
      apiFetch<ApiProduct>("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
      }),

    update: (id: number, product: Partial<ApiProduct>) =>
      apiFetch<ApiProduct>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),

    delete: (id: number) =>
      apiFetch<{ message: string }>(`/api/products/${id}`, {
        method: "DELETE",
      }),
  },

  // ---- Cart ----
  cart: {
    get: () =>
      apiFetch<ApiCart>("/api/cart"),

    addItem: (productId: number, quantity: number, size: string, color: string) =>
      apiFetch<ApiCart>("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({
          product_id: productId,
          quantity,
          selected_size: size,
          selected_color: color,
        }),
      }),

    updateItem: (itemId: number, quantity: number) =>
      apiFetch<ApiCart>(`/api/cart/items/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }),

    removeItem: (itemId: number) =>
      apiFetch<ApiCart>(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      }),

    clear: () =>
      apiFetch<ApiCart>("/api/cart", { method: "DELETE" }),
  },

  // ---- Orders ----
  orders: {
    create: (customer: ApiOrderCustomer) =>
      apiFetch<ApiOrder>("/api/orders", {
        method: "POST",
        body: JSON.stringify(customer),
      }),

    list: () =>
      apiFetch<ApiOrder[]>("/api/orders"),

    get: (id: string) =>
      apiFetch<ApiOrder>(`/api/orders/${id}`),

    updateStatus: (id: string, status: string) =>
      apiFetch<ApiOrder>(`/api/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },

  // ---- Reviews ----
  reviews: {
    forProduct: (productId: number) =>
      apiFetch<ApiReview[]>(`/api/reviews/product/${productId}`),

    add: (productId: number, author: string, rating: number, comment: string) =>
      apiFetch<ApiReview>("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, author, rating, comment }),
      }),
  },

  // ---- Admin ----
  admin: {
    stats: () =>
      apiFetch<{ total_revenue: number; total_orders: number; total_products: number; total_users: number }>("/api/admin/stats"),

    users: () =>
      apiFetch<ApiUser[]>("/api/admin/users"),

    deleteUser: (id: number) =>
      apiFetch<{ message: string }>(`/api/admin/users/${id}`, { method: "DELETE" }),

    orders: () =>
      apiFetch<ApiOrder[]>("/api/admin/orders"),

    updateOrderStatus: (id: string, status: string) =>
      apiFetch<ApiOrder>(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),

    revenueByGender: () =>
      apiFetch<Record<string, number>>("/api/admin/revenue-by-gender"),

    ordersByStatus: () =>
      apiFetch<Record<string, number>>("/api/admin/orders-by-status"),
  },
};

// ---- API response types (match backend schemas) ----
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joined?: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  gender: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  trending: boolean;
  newArrival: boolean;
  stock: number;
}

export interface ApiCartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  selected_size: string;
  selected_color: string;
}

export interface ApiCart {
  id: number;
  user_id: number;
  items: ApiCartItem[];
  subtotal: number;
}

export interface ApiOrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface ApiOrder {
  id: string;
  user_id: number;
  items: ApiOrderItem[];
  total: number;
  date: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  customer_country: string;
}

export interface ApiOrderCustomer {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  customer_country: string;
}

export interface ApiReview {
  id: number;
  product_id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}
