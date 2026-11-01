import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Database,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '42 Orchid Boulevard, Suite 5A',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
    paymentMethod: 'card',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 150 ? 0 : 15;
  const orderTotal = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDemoLogin = async () => {
    try {
      await login('sophia.m@boutique.com', 'password123');
      setFormData((prev) => ({
        ...prev,
        name: 'Sophia Montgomery',
        email: 'sophia.m@boutique.com',
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // If user not authenticated, either use demo customer or prompt
      const customerId = user?.customer_id || 1; // Default to Customer #1 (Sophia) if guest

      const items = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
      }));

      // Calls POST /api/orders which executes MySQL stored procedure create_order in a transaction
      const response = await ordersApi.create({
        customer_id: customerId,
        items,
      });

      setCompletedOrder({
        orderId: response.orderId,
        totalAmount: response.totalAmount || orderTotal,
        itemsCount: cart.length,
      });

      clearCart();
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 animate-fade-in text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
            Order Confirmed (Module 6: ACID Transaction)
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D]">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-[#765344] font-light max-w-md mx-auto">
            Order <strong className="text-[#49352D]">#{completedOrder.orderId}</strong> has been successfully placed and processed through MySQL transaction boundaries.
          </p>
        </div>

        {/* Database Transaction Insight */}
        <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-2xl p-5 text-left text-xs space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-semibold text-[#49352D]">
            <Database className="w-4 h-4 text-[#C77B61]" />
            <span>Database Execution Highlights:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[#765344] pl-2 font-mono text-[11px]">
            <li>Executed Stored Procedure <code className="bg-[#FCE9DE] px-1 rounded text-[#49352D]">create_order()</code> in ACID transaction</li>
            <li>Trigger <code className="bg-[#FCE9DE] px-1 rounded text-[#49352D]">trg_after_order_item_insert</code> automatically decremented inventory stock</li>
            <li>Calculated order sum: ${parseFloat(completedOrder.totalAmount).toFixed(2)}</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all"
          >
            View Order History
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] text-[#765344] text-xs font-semibold uppercase tracking-wider hover:bg-[#FCE9DE]/40 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#EAD5C5] pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
          Seamless Ordering
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D] mt-1">
          Checkout & Delivery
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Guest notice / 1-click login */}
      {!user && (
        <div className="p-4 rounded-2xl bg-[#FFFCF7] border border-[#EAD5C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#765344]">
            Ordering as guest or testing? You can sign in instantly with one click.
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3.5 py-1.5 rounded-lg bg-[#C77B61] text-white text-xs font-semibold hover:bg-[#B3684F] transition-colors whitespace-nowrap"
          >
            1-Click Demo Login (Sophia)
          </button>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#49352D] border-b border-[#EAD5C5] pb-3">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block mb-1">
                  Email Address (Order Confirmation)
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#765344] block mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#49352D] border-b border-[#EAD5C5] pb-3">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'upi', label: 'Instant UPI / Transfer', icon: Sparkles },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = formData.paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C77B61] bg-[#FCE9DE]/40 shadow-xs'
                        : 'border-[#EAD5C5] bg-white hover:bg-[#FCE9DE]/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={isSelected}
                      onChange={handleInputChange}
                      className="text-[#C77B61] focus:ring-[#C77B61]"
                    />
                    <Icon className="w-4 h-4 text-[#C77B61]" />
                    <span className="text-xs font-semibold text-[#49352D]">{m.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Review Sticky Card */}
        <div className="space-y-6">
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-[#49352D] border-b border-[#EAD5C5] pb-3">
              Order Review
            </h2>

            {/* Items list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-[#EAD5C5]/40">
              {cart.map((item) => (
                <div key={item.product_id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#EAD5C5] flex-shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-[#49352D] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#A89080]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-[#49352D]">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="pt-4 border-t border-[#EAD5C5] space-y-2 text-xs text-[#765344]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#49352D]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-[#EAD5C5] flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-[#49352D]">Total Due</span>
                <span className="font-serif text-2xl font-bold text-[#49352D]">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#B3684F] shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{submitting ? 'Executing Transaction...' : 'Place Order Now'}</span>
            </button>

            <p className="text-center text-[11px] text-[#A89080]">
              Transactional integrity ensured via MySQL ACID Stored Procedures.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

