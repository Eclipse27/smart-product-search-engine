import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product, showRelevance = false }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product.product_id);
  const discount = product.discount_percentage || (
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0
  );

  return (
    <div className="card-boutique group relative flex flex-col h-full bg-[#FFFFFF] rounded-2xl border border-peach-200/80 overflow-hidden shadow-sm hover:shadow-boutique-hover transition-all duration-300">
      {/* Badge container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {discount > 0 && (
          <span className="bg-terracotta text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
        {showRelevance && product.relevance_score > 0 && (
          <span className="bg-[#FFF8F0] border border-peach-300 text-terracotta text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-terracotta" />
            Score: {parseFloat(product.relevance_score).toFixed(1)}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition shadow-sm ${
          isFavorited
            ? 'bg-peach-100 text-terracotta'
            : 'bg-white/80 hover:bg-white text-cocoa/60 hover:text-terracotta'
        }`}
        title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-terracotta' : ''}`} />
      </button>

      {/* Image with zoom transition */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream-100">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';
          }}
        />
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-terracotta font-semibold mb-1">
            <span>{product.brand || product.brand_generated || 'Boutique'}</span>
            <span className="text-cocoa/50 font-normal lowercase">{product.category_name}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="font-heading text-sm font-semibold text-coffee hover:text-terracotta transition line-clamp-2 mb-2"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-semibold ml-1 text-coffee">
                {parseFloat(product.avg_rating || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-cocoa/60">
              ({product.review_count || 0})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-peach-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-coffee">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                <span className="text-xs text-cocoa/50 line-through">
                  ${parseFloat(product.original_price).toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold ${
                product.stock_quantity === 0
                  ? 'text-red-500'
                  : product.stock_quantity < 5
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {product.stock_quantity === 0
                ? 'Out of stock'
                : product.stock_quantity < 5
                ? `Only ${product.stock_quantity} left`
                : 'In stock'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock_quantity === 0}
            className="p-2.5 bg-peach-100 hover:bg-terracotta text-terracotta hover:text-white rounded-xl transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
            title="Add to shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
