import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function OrdersPage() {
  const { user, openAuthModal, login } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await ordersApi.getAll();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleDemoLogin = async () => {
    try {
      await login('sophia.m@boutique.com', 'password123');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#FCE9DE] border border-[#FAD8C8] flex items-center justify-center mx-auto text-[#C77B61]">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#49352D]">Sign In to View Orders</h1>
        <p className="text-xs text-[#765344]">
          Please authenticate to access your personal order history and delivery updates.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={openAuthModal}
            className="w-full py-3 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all"
          >
            Sign In / Register
          </button>
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] text-[#765344] text-xs font-semibold uppercase tracking-wider hover:bg-[#FCE9DE]/40 transition-all"
          >
            1-Click Demo Login (Sophia Montgomery)
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader text="Retrieving customer order records from MySQL..." />;
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#EAD5C5] pb-4 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
            Customer Account
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D] mt-1">
            Order History
          </h1>
          <p className="text-xs text-[#765344] mt-1">
            Tracking purchases for <strong className="text-[#49352D]">{user.name}</strong> ({user.email})
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="max-w-md mx-auto py-16 px-4 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FCE9DE] border border-[#FAD8C8] flex items-center justify-center mx-auto text-[#C77B61]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#49352D]">No Orders Recorded</h3>
          <p className="text-xs text-[#765344]">
            You have not placed any orders yet. Discover our curated catalog to begin.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] transition-all"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders[order.order_id] !== false; // default open
            const statusColors = {
              completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              processing: 'bg-amber-50 text-amber-700 border-amber-200',
              pending: 'bg-blue-50 text-blue-700 border-blue-200',
              cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
            };
            const statusClass = statusColors[order.status?.toLowerCase()] || statusColors.completed;

            return (
              <div
                key={order.order_id}
                className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAD5C5]/60 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#FCE9DE] text-[#C77B61]">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-bold text-[#49352D]">
                          Order #{order.order_id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusClass}`}>
                          {order.status || 'Completed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#A89080] mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[11px] text-[#765344] block">Total Amount</span>
                      <span className="font-serif text-lg font-bold text-[#49352D]">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleOrderExpand(order.order_id)}
                      className="p-2 rounded-xl text-[#765344] hover:bg-[#FCE9DE]/40 transition-colors"
                      title="Toggle Details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Items Breakdown */}
                {isExpanded && (
                  <div className="pt-2 divide-y divide-[#EAD5C5]/40">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#EAD5C5] flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#FCE9DE] flex items-center justify-center text-[#C77B61] flex-shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-[#49352D] truncate">
                              {item.product_name || `Product #${item.product_id}`}
                            </p>
                            <p className="text-[11px] text-[#765344]">
                              Quantity: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="font-serif font-bold text-[#49352D]">
                          ${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

