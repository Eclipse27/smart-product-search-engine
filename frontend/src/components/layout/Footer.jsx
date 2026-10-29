import { Database, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500
                              flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">SmartEngine</h3>
                <p className="text-xs text-slate-500">Powered by MySQL</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart Product Search & Recommendation Engine built with Advanced SQL techniques.
              Demonstrating MySQL as an intelligence layer for e-commerce.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-sm hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link to="/search?q=wireless" className="text-sm hover:text-brand-400 transition-colors">Try Smart Search</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-white mb-4">Technology Stack</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>🗄️ MySQL 8+ — Core Intelligence Layer</li>
              <li>⚡ Node.js + Express — API Layer</li>
              <li>⚛️ React + Vite — Frontend</li>
              <li>🎨 Tailwind CSS — Styling</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            Advanced SQL Academic Project • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
