import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-coffee/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l border-peach-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-peach-100 flex items-center justify-between bg-[#FFF8F0]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="font-heading text-xl text-coffee">Your Shopping Bag</h2>
              <span className="bg-peach-200 text-terracotta text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-cocoa hover:text-terracotta hover:bg-peach-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-peach-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-terracotta mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-heading text-lg text-coffee mb-1">Your bag is empty</h3>
                <p className="text-cocoa/70 text-sm mb-6 max-w-xs">
                  Discover our curated collection of luxury electronics, clothing, and lifestyle items.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="bg-terracotta hover:bg-terracotta-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-md shadow-terracotta/20"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product_id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-peach-200 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-terracotta font-semibold">
                      {item.brand}
                    </p>
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="font-heading text-sm text-coffee hover:text-terracotta transition truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-semibold text-coffee mt-1">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-peach-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-peach-50 text-cocoa transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-coffee">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-peach-50 text-cocoa transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-cocoa/60 hover:text-red-500 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-peach-100 bg-[#FFF8F0] space-y-4">
              <div className="flex justify-between items-center text-sm text-cocoa">
                <span>Subtotal</span>
                <span className="font-heading text-lg font-bold text-coffee">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-cocoa/70">
                Taxes and complimentary boutique shipping calculated at checkout.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-terracotta hover:bg-terracotta-600 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-terracotta/25 transition active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full bg-white hover:bg-peach-50 text-coffee border border-peach-200 py-2.5 rounded-xl font-medium text-sm transition"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

