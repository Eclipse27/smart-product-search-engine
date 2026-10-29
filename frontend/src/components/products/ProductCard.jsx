import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Zap } from 'lucide-react';
import Rating from '../ui/Rating';

export default function ProductCard({ product }) {
  const {
    slug, name, price, original_price, image_url, avg_rating,
    review_count, stock_status, discount_percentage, category_name,
    brand, relevance_score, view_count,
  } = product;

  const stockBadge = {
    in_stock: { label: 'In Stock', class: 'badge-success' },
    low_stock: { label: 'Few Left', class: 'badge-warning' },
    out_of_stock: { label: 'Out of Stock', class: 'badge-danger' },
  };

  const badge = stockBadge[stock_status] || stockBadge.in_stock;

  return (
    <Link to={`/product/${slug}`} className="product-card group block animate-fade-in">
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=e0e7ff&color=4f46e5&font-size=0.33`;
          }}
        />

        {/* Discount badge */}
        {discount_percentage > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-500 text-white
                           text-xs font-bold shadow-lg">
            -{discount_percentage}%
          </span>
        )}

        {/* Relevance score (shown in search results) */}
        {relevance_score > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-brand-600/90 text-white
                           text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm">
            <Zap className="w-3 h-3" />
            {typeof relevance_score === 'number' && relevance_score < 100
              ? relevance_score.toFixed(2)
              : 'Match'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-medium text-brand-500 mb-1">{category_name}</p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2
                       group-hover:text-brand-600 transition-colors">
          {name}
        </h3>

        {/* Rating */}
        <Rating rating={parseFloat(avg_rating)} count={review_count} />

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${parseFloat(price).toFixed(2)}
          </span>
          {original_price && parseFloat(original_price) > parseFloat(price) && (
            <span className="text-sm text-slate-400 line-through">
              ${parseFloat(original_price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`badge ${badge.class}`}>{badge.label}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Eye className="w-3 h-3" />
            {view_count || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
