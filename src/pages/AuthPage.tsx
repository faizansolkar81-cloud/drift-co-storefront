// =============================================================
// Drift & Co. — Login & Register Pages
// Two simple authentication forms. Login checks credentials
// against the in-memory user list; Register creates a new user.
// Both store the logged-in user in context + localStorage.
// On a real backend these would POST to FastAPI auth endpoints.
// =============================================================
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface AuthPageProps {
  mode: "login" | "register";
  onNavigate: (path: string) => void;
}

export default function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const { login, register } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const ok = login(email, password);
      if (ok) onNavigate("/");
      else setError("Invalid email or password. Try rahul@example.com / pass123");
    } else {
      if (!name.trim()) { setError("Please enter your name."); return; }
      const ok = register(name, email, password);
      if (ok) onNavigate("/");
      else setError("An account with this email already exists.");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isLogin ? "Sign in to your Drift & Co. account" : "Join Drift & Co. and start shopping"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (register only) */}
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-gray-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Switch link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => onNavigate(isLogin ? "/register" : "/login")}
              className="font-semibold text-gray-900 underline">
              {isLogin ? "Register here" : "Sign in"}
            </button>
          </p>

          {/* Demo credentials hint */}
          {isLogin && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
              <p className="font-semibold text-gray-600">Demo accounts:</p>
              <p className="mt-1">User: rahul@example.com / pass123</p>
              <p>Admin: admin@driftandco.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
