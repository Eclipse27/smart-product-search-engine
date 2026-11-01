import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Sparkles, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import SearchBar from '../search/SearchBar';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const { customer, isAuthenticated, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFCF7]/95 backdrop-blur-md border-b border-peach-200 shadow-sm">
        {/* Top Announcement Bar */}
        <div className="bg-peach-100 text-cocoa text-xs py-1.5 px-4 text-center font-medium border-b border-peach-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-terracotta" />
          <span>Intelligent E-Commerce Discovery Powered by Advanced MySQL 8+ Techniques</span>
          <span className="hidden sm:inline font-cursive text-sm text-terracotta font-bold">~ Peachy Boutique Experience ~</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col flex-shrink-0 group">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-coffee group-hover:text-terracotta transition">
              AURA
            </span>
            <span className="font-cursive text-sm sm:text-base text-terracotta -mt-1 group-hover:scale-105 transition-transform">
              Smart Boutique Engine
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-coffee">
            <Link to="/" className="hover:text-terracotta transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-terracotta transition">
              Shop All
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-terracotta transition py-2">
                Categories <ChevronDown className="w-3.5 h-3.5 text-cocoa/60 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-[#FFFDF9] border border-peach-200 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                <Link to="/category/smartphones" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Smartphones</Link>
                <Link to="/category/laptops" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Laptops</Link>
                <Link to="/category/headphones" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Headphones</Link>
                <Link to="/category/clothing" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Clothing & Shoes</Link>
                <Link to="/category/cameras" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Cameras</Link>
                <Link to="/category/smartwatches" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Smartwatches</Link>
                <Link to="/category/accessories" className="block px-4 py-2 text-xs hover:bg-peach-50 text-coffee">Accessories</Link>
              </div>
            </div>
            <Link to="/products?sort_by=popularity" className="hover:text-terracotta transition">
              Trending
            </Link>
            <Link to="/products?sort_by=rating" className="hover:text-terracotta transition">
              Top Ranked
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-coffee hover:text-terracotta hover:bg-peach-100 rounded-full transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-coffee hover:text-terracotta hover:bg-peach-100 rounded-full transition"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-coffee hover:text-terracotta hover:bg-peach-100 rounded-full transition"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 pl-2.5 bg-peach-100 hover:bg-peach-200 border border-peach-300 rounded-full text-xs font-semibold text-coffee transition"
                >
                  <User className="w-4 h-4 text-terracotta" />
                  <span className="hidden sm:inline max-w-[80px] truncate">{customer?.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-[#FFFDF9] border border-peach-200 rounded-2xl shadow-xl py-2 z-50 animate-scale-in"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-peach-100">
                      <p className="text-xs font-semibold text-coffee truncate">{customer?.name}</p>
                      <p className="text-[11px] text-cocoa/60 truncate">{customer?.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-coffee hover:bg-peach-50 transition"
                    >
                      <Package className="w-4 h-4 text-terracotta" /> Order History
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-coffee hover:bg-peach-50 transition"
                    >
                      <Heart className="w-4 h-4 text-terracotta" /> My Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 border-t border-peach-100 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-terracotta hover:bg-terracotta-600 text-white px-4 py-2 rounded-full text-xs font-semibold transition shadow-md shadow-terracotta/20 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-4 bg-[#FFFCF7] border-b border-peach-200 animate-slide-down">
            <SearchBar />
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
