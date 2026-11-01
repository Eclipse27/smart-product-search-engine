import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Database, Search, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFF8F0] border-t border-peach-200 mt-20 text-coffee">
      {/* Upper Features Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-peach-200/70">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start p-4 bg-white/60 rounded-2xl border border-peach-200/60">
            <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-terracotta mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base text-coffee">Typo-Tolerant Search</h4>
            <p className="text-xs text-cocoa/70 mt-1">
              Natural Language FULLTEXT + Soundex & Levenshtein matching in MySQL 8+.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 bg-white/60 rounded-2xl border border-peach-200/60">
            <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-terracotta mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base text-coffee">Dynamic JSON Filtering</h4>
            <p className="text-xs text-cocoa/70 mt-1">
              Category-specific specs parsed and indexed directly inside the database.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 bg-white/60 rounded-2xl border border-peach-200/60">
            <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-terracotta mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base text-coffee">Advanced Recommendations</h4>
            <p className="text-xs text-cocoa/70 mt-1">
              Co-purchases, co-views & personalized CTE user affinity modeling.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 bg-white/60 rounded-2xl border border-peach-200/60">
            <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center text-terracotta mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-semibold text-base text-coffee">Transactional Integrity</h4>
            <p className="text-xs text-cocoa/70 mt-1">
              Atomic checkout transactions, stock decrement triggers, and rating views.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="font-heading text-2xl font-bold tracking-tight text-coffee">AURA</span>
          <p className="font-cursive text-base text-terracotta mb-3">Smart Boutique Engine</p>
          <p className="text-xs text-cocoa/80 leading-relaxed">
            Where luxury aesthetic meets advanced database engineering. Powered by MySQL 8+ stored procedures, window functions, and full-text indexes.
          </p>
        </div>

        <div>
          <h5 className="font-heading text-sm font-semibold text-coffee uppercase tracking-wider mb-3">
            Discovery
          </h5>
          <ul className="space-y-2 text-xs text-cocoa">
            <li><Link to="/products" className="hover:text-terracotta transition">All Collections</Link></li>
            <li><Link to="/products?sort_by=popularity" className="hover:text-terracotta transition">Trending Products</Link></li>
            <li><Link to="/products?sort_by=rating" className="hover:text-terracotta transition">Top Rated by Window Functions</Link></li>
            <li><Link to="/products?sort_by=newest" className="hover:text-terracotta transition">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-heading text-sm font-semibold text-coffee uppercase tracking-wider mb-3">
            Popular Categories
          </h5>
          <ul className="space-y-2 text-xs text-cocoa">
            <li><Link to="/category/smartphones" className="hover:text-terracotta transition">Smartphones</Link></li>
            <li><Link to="/category/laptops" className="hover:text-terracotta transition">Laptops</Link></li>
            <li><Link to="/category/headphones" className="hover:text-terracotta transition">Headphones & Audio</Link></li>
            <li><Link to="/category/clothing" className="hover:text-terracotta transition">Clothing & Fashion</Link></li>
            <li><Link to="/category/smartwatches" className="hover:text-terracotta transition">Smartwatches</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-heading text-sm font-semibold text-coffee uppercase tracking-wider mb-3">
            Academic Project Info
          </h5>
          <p className="text-xs text-cocoa/80 mb-2">
            SRM Institute of Science and Technology<br />
            School of Computing — Advanced SQL
          </p>
          <p className="text-[11px] text-cocoa/60">
            Supervisor: Dr. B. Prakash<br />
            Team: Nikhilesh, Rajat, Rohit, Keerthana
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-peach-200 bg-[#FFF3E8] py-4 text-center text-xs text-cocoa/70 flex items-center justify-center gap-1">
        <span>Crafted with</span> <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" /> <span>using MySQL 8+ & React 18</span>
      </div>
    </footer>
  );
}
