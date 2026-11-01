import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [promoError, setPromoError] = useState('');

  const subtotal = getCartTotal();
  const isFreeShipping = subtotal >= 150 || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 15;
  const discountAmount = (subtotal * discountApplied) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'AURA10' || code === 'LUXE10') {
      setDiscountApplied(10);
      setPromoError('');
    } else if (code === 'VIP20') {
      setDiscountApplied(20);
      setPromoError('');
    } else {
      setPromoError('Invalid promotion code. Try "AURA10" for 10% off.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#FCE9DE] border border-[#FAD8C8] flex items-center justify-center mx-auto text-[#C77B61] shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#49352D]">Your Shopping Bag is Empty</h1>
          <p className="text-sm text-[#765344] font-light max-w-md mx-auto">
            Discover our curated seasonal collection of artisan creations, intelligent essentials, and luxury items.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all"
        >
          <span>Explore Boutique</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#EAD5C5] pb-4 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
            Order Preparation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D] mt-1">
            Shopping Bag ({getCartCount()} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A89080] hover:text-[#C77B61] transition-colors underline underline-offset-4"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm divide-y divide-[#EAD5C5]/60">
            {cart.map((item) => {
              const price = parseFloat(item.price);
              const lineTotal = (price * item.quantity).toFixed(2);

              return (
                <div key={item.product_id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#FCE9DE]/40 border border-[#EAD5C5] overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif text-base font-bold text-[#49352D] hover:text-[#C77B61] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.brand && (
                      <p className="text-[11px] uppercase tracking-wider text-[#A89080]">
                        {item.brand}
                      </p>
                    )}
                    <p className="font-serif text-sm font-semibold text-[#C77B61]">
                      ${price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[#EAD5C5] bg-white">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1.5 text-[#765344] hover:text-[#49352D]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#49352D]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1.5 text-[#765344] hover:text-[#49352D]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="w-20 text-right font-serif text-sm font-bold text-[#49352D]">
                      ${lineTotal}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-[#A89080] hover:text-[#C77B61] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#765344] hover:text-[#C77B61] transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#49352D] border-b border-[#EAD5C5] pb-4">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-[#765344]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#49352D]">${subtotal.toFixed(2)}</span>
              </div>

              {discountApplied > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotion Discount ({discountApplied}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAD5C5] flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-[#49352D]">Estimated Total</span>
                <span className="font-serif text-2xl font-bold text-[#49352D]">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AURA10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#EAD5C5] bg-white text-xs uppercase tracking-wider text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FCE9DE] text-[#765344] text-xs font-semibold hover:bg-[#FAD8C8] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-rose-600">{promoError}</p>
              )}
              {discountApplied > 0 && (
                <p className="text-[11px] text-emerald-600">
                  {discountApplied}% promo code applied!
                </p>
              )}
            </form>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#B3684F] shadow-sm hover:shadow-md transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-[#EAD5C5]/60 space-y-2 text-[11px] text-[#A89080]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C77B61]" />
                <span>256-bit encrypted secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C77B61]" />
                <span>Complimentary express delivery on orders over $150</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

