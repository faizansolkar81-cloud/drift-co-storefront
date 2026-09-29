// =============================================================
// Drift & Co. — Footer
// Bottom footer with brand info, quick links, customer service
// links, and social media icons. Purely presentational.
// =============================================================
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">Drift <span className="text-gray-400 font-light">&</span> Co.</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Discover your style with Drift & Co. — premium fashion for men, women, and kids. Quality you can feel, styles you'll love.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-900 hover:text-white" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-900 hover:text-white" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-900 hover:text-white" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><button onClick={() => onNavigate("/men")} className="transition hover:text-gray-900">Men</button></li>
              <li><button onClick={() => onNavigate("/women")} className="transition hover:text-gray-900">Women</button></li>
              <li><button onClick={() => onNavigate("/kids")} className="transition hover:text-gray-900">Kids</button></li>
              <li><button onClick={() => onNavigate("/wishlist")} className="transition hover:text-gray-900">Wishlist</button></li>
              <li><button onClick={() => onNavigate("/search?q=new")} className="transition hover:text-gray-900">New Arrivals</button></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Customer Care</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><a href="#" className="transition hover:text-gray-900">Shipping & Returns</a></li>
              <li><a href="#" className="transition hover:text-gray-900">Size Guide</a></li>
              <li><a href="#" className="transition hover:text-gray-900">FAQ</a></li>
              <li><button onClick={() => onNavigate("/login")} className="transition hover:text-gray-900">My Account</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Contact Us</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><MapPin size={16} /> 123 Fashion Street, Mumbai, India</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail size={16} /> hello@driftandco.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © 2026 Drift & Co. — B.Sc. IT College Project. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
