import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import ProductCard from '../components/products/ProductCard';
import {
  ChevronRight,
  Package,
  Eye,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Layers,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [related, setRelated] = useState({
    frequently_bought_together: [],
    customers_also_viewed: [],
    similar_products: [],
  });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bundleSelected, setBundleSelected] = useState(true);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await productsApi.getBySlug(slug);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setReviewSummary(data.reviewSummary);

        if (data.product?.product_id) {
          // Log view (invokes MySQL view_count increment trigger)
          productsApi.logView(data.product.product_id, user?.customer_id || null).catch(() => {});

          // Fetch Module 3 Recommendations (Frequently Bought Together, Customers Also Viewed, Similar)
          const relData = await productsApi.getRelated(data.product.product_id).catch(() => ({}));
          setRelated({
            frequently_bought_together: relData.frequently_bought_together || [],
            customers_also_viewed: relData.customers_also_viewed || [],
            similar_products: relData.similar_products || [],
          });
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    setQuantity(1);
    setReviewSuccess(false);
    setReviewError('');
  }, [slug, user?.customer_id]);

  if (loading) return <Loader text="Presenting boutique artisan piece..." />;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#49352D] mb-2">Item Unavailable</h2>
        <p className="text-sm text-[#765344] mb-6">The item you are searching for does not exist in the collection.</p>
        <Link
          to="/products"
          className="inline-flex px-6 py-3 rounded-xl bg-[#C77B61] text-white font-medium text-sm hover:bg-[#B3684F]"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Parse JSON attributes
  let attributes = product.attributes;
  if (typeof attributes === 'string') {
    try {
      attributes = JSON.parse(attributes);
    } catch {
      attributes = {};
    }
  }
  attributes = attributes || {};

  const stockBadge = {
    in_stock: { label: 'In Stock', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    low_stock: { label: `Only ${product.stock_quantity} Left!`, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    out_of_stock: { label: 'Out of Stock', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  };
  const currentBadge = stockBadge[product.stock_status] || stockBadge.in_stock;

  const fbtItem = related.frequently_bought_together?.[0];
  const bundleTotal = fbtItem
    ? (parseFloat(product.price) + parseFloat(fbtItem.price)).toFixed(2)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddBundle = () => {
    addToCart(product, 1);
    if (bundleSelected && fbtItem) {
      addToCart(fbtItem, 1);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please share your thoughts in the review comment.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    try {
      await productsApi.submitReview(product.product_id, {
        rating: reviewRating,
        comment: reviewComment,
        customerId: user.customer_id,
      });

      // Reload product details to show newly recalculated avg_rating and review count
      const updated = await productsApi.getBySlug(slug);
      setProduct(updated.product);
      setReviews(updated.reviews || []);
      setReviewSummary(updated.reviewSummary);
      setReviewSuccess(true);
      setReviewComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#765344] flex-wrap">
        <Link to="/" className="hover:text-[#C77B61]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A89080]" />
        <Link to="/products" className="hover:text-[#C77B61]">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A89080]" />
        <Link to={`/category/${product.category_slug}`} className="hover:text-[#C77B61]">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A89080]" />
        <span className="font-semibold text-[#49352D] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FFFCF7] border border-[#EAD5C5] shadow-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=600&background=fce9de&color=765344&font-size=0.25`;
              }}
            />
            {product.discount_percentage > 0 && (
              <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-[#C77B61] text-white text-xs font-bold shadow-md uppercase tracking-wider">
                {product.discount_percentage}% Savings
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/90 backdrop-blur-sm border border-[#EAD5C5] text-[#765344] hover:text-[#C77B61] shadow-md transition-all"
              title="Add to Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(product.product_id) ? 'fill-[#C77B61] text-[#C77B61]' : ''
                }`}
              />
            </button>
          </div>

          {/* Quick Trust Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] space-y-1">
              <Truck className="w-4 h-4 text-[#C77B61] mx-auto" />
              <p className="text-[11px] font-semibold text-[#49352D]">Express Delivery</p>
              <p className="text-[10px] text-[#765344]">Complimentary on $150+</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#C77B61] mx-auto" />
              <p className="text-[11px] font-semibold text-[#49352D]">Guaranteed Quality</p>
              <p className="text-[10px] text-[#765344]">100% Authentic</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] space-y-1">
              <RotateCcw className="w-4 h-4 text-[#C77B61] mx-auto" />
              <p className="text-[11px] font-semibold text-[#49352D]">Effortless Return</p>
              <p className="text-[10px] text-[#765344]">30-Day Window</p>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-[#FCE9DE] text-[#C77B61] text-xs font-semibold uppercase tracking-wider">
                {product.category_name}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${currentBadge.badgeClass}`}>
                {currentBadge.label}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D] leading-tight">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-xs text-[#765344] mt-1 uppercase tracking-widest font-semibold">
                Brand: <span className="text-[#C77B61]">{product.brand}</span>
              </p>
            )}
          </div>

          {/* Rating and Social Proof */}
          <div className="flex items-center gap-4 text-xs text-[#765344]">
            <Rating rating={parseFloat(product.avg_rating || 0)} count={product.review_count} size="lg" />
            <span className="text-[#EAD5C5]">|</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#C77B61]" />
              <strong>{product.view_count || 0}</strong> views
            </span>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-[#FFFCF7] border border-[#EAD5C5]">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#49352D]">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <span className="text-base text-[#A89080] line-through font-light">
                ${parseFloat(product.original_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#765344]">
              About This Piece
            </h3>
            <p className="text-sm text-[#49352D] leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#765344]">
                Quantity:
              </span>
              <div className="flex items-center rounded-xl border border-[#EAD5C5] bg-[#FFFCF7]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 text-[#765344] hover:text-[#49352D] disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#49352D]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                  disabled={quantity >= product.stock_quantity}
                  className="p-2.5 text-[#765344] hover:text-[#49352D] disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status === 'out_of_stock'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-sm hover:bg-[#B3684F] shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock_status === 'out_of_stock'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#49352D] text-white font-medium text-sm hover:bg-[#382822] shadow-sm hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>

          {/* Dynamic JSON Specifications Table (Module 2) */}
          {Object.keys(attributes).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#EAD5C5]">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#765344]">
                <Layers className="w-3.5 h-3.5 text-[#C77B61]" />
                <span>Dynamic JSON Specifications</span>
              </div>
              <div className="rounded-2xl border border-[#EAD5C5] overflow-hidden bg-[#FFFCF7]">
                <table className="w-full text-xs">
                  <tbody>
                    {Object.entries(attributes).map(([k, v], idx) => (
                      <tr
                        key={k}
                        className={idx % 2 === 0 ? 'bg-[#FFFCF7]' : 'bg-[#FCE9DE]/20'}
                      >
                        <td className="px-4 py-2.5 font-semibold text-[#765344] capitalize w-2/5 border-b border-[#EAD5C5]/40">
                          {k.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-2.5 text-[#49352D] border-b border-[#EAD5C5]/40">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODULE 3: FREQUENTLY BOUGHT TOGETHER ================= */}
      {fbtItem && (
        <section className="rounded-3xl bg-[#FFFCF7] border border-[#EAD5C5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#EAD5C5] pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Bundle (Module 3: Collaborative SQL)</span>
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#49352D] mt-1">
              Frequently Bought Together
            </h2>
            <p className="text-xs text-[#765344]">
              Identified through MySQL market basket association across historical customer checkout orders.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Product 1 */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#EAD5C5] bg-white flex-shrink-0">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>

              <span className="text-2xl font-bold text-[#C77B61]">+</span>

              {/* Product 2 */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#EAD5C5] bg-white flex-shrink-0">
                <img src={fbtItem.image_url} alt={fbtItem.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleSelected}
                    onChange={(e) => setBundleSelected(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C77B61] border-[#EAD5C5] focus:ring-[#C77B61]"
                  />
                  <span className="text-xs font-bold text-[#49352D] hover:text-[#C77B61]">
                    Add {fbtItem.name} (${parseFloat(fbtItem.price).toFixed(2)})
                  </span>
                </label>
                <p className="text-[11px] text-[#765344]">
                  Co-purchased in over {fbtItem.co_occurrence_count || 12} transactions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#EAD5C5] pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
              <div>
                <span className="text-[11px] text-[#765344] block">Bundle Price:</span>
                <span className="font-serif text-2xl font-bold text-[#49352D]">
                  ${bundleSelected ? bundleTotal : parseFloat(product.price).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddBundle}
                className="px-5 py-3 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all"
              >
                Add Bundle to Bag
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ================= MODULE 3: CUSTOMERS ALSO VIEWED ================= */}
      {related.customers_also_viewed?.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#EAD5C5] pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
              Browsing Intelligence
            </span>
            <h2 className="font-serif text-2xl font-normal text-[#49352D] mt-1">
              Customers Also Viewed
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.customers_also_viewed.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= MODULE 3: SIMILAR PRODUCTS ================= */}
      {related.similar_products?.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#EAD5C5] pb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
              Related Artisans
            </span>
            <h2 className="font-serif text-2xl font-normal text-[#49352D] mt-1">
              Similar in Category
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.similar_products.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= REVIEWS & TRIGGER RECALCULATION (MODULE 6) ================= */}
      <section className="border-t border-[#EAD5C5] pt-12 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
            Verified Feedback (Module 6: Triggers)
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-[#765344] mt-1 font-mono">
            Trigger <code className="bg-[#FFFCF7] px-1.5 py-0.5 rounded border border-[#EAD5C5]">trg_after_review_insert</code> recalculates average ratings atomically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary Card */}
          <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <span className="font-serif text-5xl font-bold text-[#49352D]">
                {parseFloat(product.avg_rating || 0).toFixed(1)}
              </span>
              <div className="flex justify-center">
                <Rating rating={parseFloat(product.avg_rating || 0)} size="lg" />
              </div>
              <p className="text-xs text-[#765344]">
                Aggregated from {product.review_count || 0} reviews
              </p>
            </div>

            {/* Distribution */}
            {reviewSummary && (
              <div className="space-y-2 pt-4 border-t border-[#EAD5C5]">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviewSummary[`${['one', 'two', 'three', 'four', 'five'][stars - 1]}_star`] || 0;
                  const total = reviewSummary.total_reviews || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-7 text-[#765344]">{stars}★</span>
                      <div className="flex-1 h-2 rounded-full bg-[#FCE9DE] overflow-hidden">
                        <div
                          className="h-full bg-[#C77B61] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-[#A89080]">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review List & Submission Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submit Review Card */}
            <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#49352D] mb-4">
                Write a Review
              </h3>

              {reviewSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Review published! MySQL trigger refreshed the average rating.</span>
                </div>
              )}

              {reviewError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#765344] block mb-2">
                    Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#765344] ml-2 font-semibold">
                      {reviewRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#765344] block mb-2">
                    Your Experience:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your thoughts on craftsmanship, fit, or performance..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] placeholder-[#CBBBB0] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  {!user && (
                    <span className="text-xs text-[#765344]">
                      You will be asked to log in to post your review.
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#FFFCF7] border border-[#EAD5C5] text-xs text-[#765344]">
                  Be the first to share a review for this piece.
                </div>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r.review_id}
                    className="p-5 rounded-2xl bg-[#FFFCF7] border border-[#EAD5C5] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#FCE9DE] text-[#C77B61] font-bold text-xs flex items-center justify-center">
                          {r.customer_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#49352D]">{r.customer_name}</p>
                          <p className="text-[10px] text-[#A89080]">
                            {new Date(r.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <Rating rating={r.rating} />
                    </div>
                    {r.comment && (
                      <p className="text-xs text-[#765344] leading-relaxed pt-1 font-light">
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
