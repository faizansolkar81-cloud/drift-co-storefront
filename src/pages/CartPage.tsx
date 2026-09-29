// =============================================================
// Drift & Co. — Shopping Cart Page
// Lists all items in the cart with the ability to change
// quantity, remove items, and see subtotal + total. Includes
// a "Proceed to Checkout" button. All prices in INR (₹).
// Free shipping on orders over ₹2,000.
// =============================================================
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/utils/format";

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useApp();

  // Free shipping over ₹2,000, otherwise ₹99
  const shipping = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 99;
  const tax = Math.round(cartSubtotal * 0.05); // 5% GST
  const total = cartSubtotal + shipping + tax;

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => onNavigate("/men")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Start Shopping <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-gray-500">{cart.length} item(s) in your cart</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ---- Cart items ---- */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4"
            >
              {/* Thumbnail */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-28 w-24 flex-shrink-0 rounded-lg object-cover"
              />

              {/* Details */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="cursor-pointer text-sm font-semibold text-gray-900 hover:text-gray-600"
                      onClick={() => onNavigate(`/product/${item.product.id}`)}
                    >
                      {item.product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">{item.product.category}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Size: <span className="font-medium text-gray-700">{item.selectedSize}</span> · Color:{" "}
                      <span className="font-medium text-gray-700">{item.selectedColor}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Quantity + price */}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-lg border border-gray-200">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-gray-600 transition hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, Math.min(item.product.stock, item.quantity + 1))}
                      className="px-2.5 py-1.5 text-gray-600 transition hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
                {item.quantity >= item.product.stock && (
                  <p className="mt-1 text-xs text-amber-600">Max stock reached ({item.product.stock} available)</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ---- Order summary ---- */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST (5%)</span>
                <span className="font-semibold text-gray-900">{formatINR(tax)}</span>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Add {formatINR(2000 - cartSubtotal)} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">{formatINR(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("/men")}
              className="mt-3 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
