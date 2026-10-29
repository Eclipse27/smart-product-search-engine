import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api';
import Rating from '../components/ui/Rating';
import Loader from '../components/ui/Loader';
import { ChevronRight, Package, Eye, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Calls get_product_detail STORED PROCEDURE
        const data = await productsApi.getBySlug(slug);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setReviewSummary(data.reviewSummary);

        // Log the product view (triggers MySQL TRIGGER for view_count)
        if (data.product?.product_id) {
          productsApi.logView(data.product.product_id).catch(() => {});
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <Loader text="Loading product details..." />;
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  // Parse attributes
  let attributes = product.attributes;
  if (typeof attributes === 'string') {
    try { attributes = JSON.parse(attributes); } catch { attributes = {}; }
  }
  attributes = attributes || {};

  const stockBadge = {
    in_stock: { label: 'In Stock', class: 'badge-success', icon: ShieldCheck },
    low_stock: { label: 'Only a few left!', class: 'badge-warning', icon: Package },
    out_of_stock: { label: 'Out of Stock', class: 'badge-danger', icon: Package },
  };
  const badge = stockBadge[product.stock_status] || stockBadge.in_stock;

  // Rating distribution
  const ratingBars = reviewSummary ? [
    { stars: 5, count: reviewSummary.five_star || 0 },
    { stars: 4, count: reviewSummary.four_star || 0 },
    { stars: 3, count: reviewSummary.three_star || 0 },
    { stars: 2, count: reviewSummary.two_star || 0 },
    { stars: 1, count: reviewSummary.one_star || 0 },
  ] : [];
  const maxRatingCount = Math.max(...ratingBars.map(r => r.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/category/${product.category_slug}`} className="hover:text-brand-600">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&size=600&background=e0e7ff&color=4f46e5&font-size=0.25`;
              }}
            />
          </div>
          {product.discount_percentage > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-rose-500 text-white
                             text-sm font-bold shadow-lg">
              -{product.discount_percentage}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge badge-info mb-3">{product.category_name}</span>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{product.name}</h1>

          {product.brand && (
            <p className="text-sm text-slate-500 mb-4">Brand: <span className="font-semibold text-slate-700">{product.brand}</span></p>
          )}

          {/* Rating */}
          <div className="mb-4">
            <Rating rating={parseFloat(product.avg_rating)} count={product.review_count} size="lg" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <span className="text-lg text-slate-400 line-through">
                ${parseFloat(product.original_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`badge ${badge.class} text-sm`}>
              <badge.icon className="w-3.5 h-3.5 mr-1" />
              {badge.label}
            </span>
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <Eye className="w-4 h-4" />
              {product.view_count} views
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Attributes (from JSON) */}
          {Object.keys(attributes).length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Specifications</h3>
              <div className="bg-slate-50 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(attributes).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-2.5 text-sm font-medium text-slate-500 capitalize w-1/3">
                          {key.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-slate-800 font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: ShieldCheck, label: 'Secure Payment' },
              { icon: RotateCcw, label: '30-Day Returns' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
                <item.icon className="w-4 h-4 text-brand-500" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          {reviewSummary && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-slate-900 mb-2">
                  {parseFloat(reviewSummary.calculated_avg_rating || 0).toFixed(1)}
                </p>
                <Rating
                  rating={parseFloat(reviewSummary.calculated_avg_rating || 0)}
                  size="lg"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Based on {reviewSummary.total_reviews} reviews
                </p>
              </div>

              {/* Rating Distribution Bars */}
              <div className="space-y-2">
                {ratingBars.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-8">{stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${(count / maxRatingCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No reviews yet for this product.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-violet-400
                                      flex items-center justify-center text-white font-bold text-sm">
                        {review.customer_name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{review.customer_name}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <Rating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
