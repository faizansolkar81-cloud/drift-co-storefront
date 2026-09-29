// =============================================================
// Drift & Co. — Home Page
// Landing page with: hero banner ("Discover Your Style" + Shop
// Now button), featured categories (Men/Women/Kids), trending
// products, and new arrivals sections.
// =============================================================
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

interface HomePageProps {
  onNavigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export default function HomePage({ onNavigate, onViewProduct }: HomePageProps) {
  const { allProducts } = useApp();

  const trending = allProducts.filter((p) => p.trending).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.newArrival).slice(0, 4);

  // Featured category cards
  const categories = [
    { label: "Men", path: "/men", image: "https://images.pexels.com/photos/10482937/pexels-photo-10482937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", desc: "Kurtas, shirts, jeans & more" },
    { label: "Women", path: "/women", image: "https://images.pexels.com/photos/29850173/pexels-photo-29850173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", desc: "Sarees, kurtis, dresses & more" },
    { label: "Kids", path: "/kids", image: "https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", desc: "Ethnic wear, tees, jeans & more" },
  ];

  return (
    <div>
      {/* ---- Hero Banner ---- */}
      <section className="relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7679784/pexels-photo-7679784.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Fashion store"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur">
              <Sparkles size={14} /> New Collection 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your Style
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Premium fashion for every moment. Explore curated collections for men, women, and kids — designed to inspire.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("/men")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Shop Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate("/women")}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Featured Categories ---- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Featured Categories</h2>
          <p className="mt-2 text-gray-500">Shop by department and find your perfect look</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onNavigate(cat.path)}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-left">
                <h3 className="text-2xl font-bold text-white">{cat.label}</h3>
                <p className="mt-1 text-sm text-gray-200">{cat.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
                  Shop Now <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ---- Trending Products ---- */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Trending Now</h2>
              <p className="mt-2 text-gray-500">Our most-loved pieces this season</p>
            </div>
            <button
              onClick={() => onNavigate("/search?q=trending")}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} onView={onViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- New Arrivals ---- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">New Arrivals</h2>
            <p className="mt-2 text-gray-500">Fresh drops just landed — be the first to wear them</p>
          </div>
          <button
            onClick={() => onNavigate("/search?q=new")}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onView={onViewProduct} />
          ))}
        </div>
      </section>

      {/* ---- Promo Banner ---- */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Free Shipping on Orders Over ₹2,000</h2>
          <p className="mt-3 text-gray-300">Plus easy 30-day returns. Shop with confidence.</p>
          <button
            onClick={() => onNavigate("/men")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Start Shopping <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
