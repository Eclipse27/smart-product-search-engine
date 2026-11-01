import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.product_id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-[#FCE9DE] border border-[#FAD8C8] flex items-center justify-center mx-auto text-[#C77B61] shadow-sm">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#49352D]">Your Wishlist is Empty</h1>
          <p className="text-sm text-[#765344] font-light max-w-md mx-auto">
            Save pieces you love while exploring our intelligent catalog. Revisit them whenever inspiration strikes.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#B3684F] shadow-sm transition-all"
        >
          <span>Discover Boutique</span>
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
            Curated Favorites
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D] mt-1">
            Saved Wishlist ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-[#A89080] hover:text-[#C77B61] transition-colors underline underline-offset-4"
        >
          Clear Wishlist
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.product_id}
            className="group bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-[#FCE9DE]/30">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#765344] hover:text-[#C77B61] shadow-sm transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                {item.category_name && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C77B61]">
                    {item.category_name}
                  </span>
                )}
                <Link
                  to={`/product/${item.slug}`}
                  className="font-serif text-base font-bold text-[#49352D] hover:text-[#C77B61] transition-colors line-clamp-1 block"
                >
                  {item.name}
                </Link>
                <p className="font-serif text-lg font-bold text-[#49352D]">
                  ${parseFloat(item.price).toFixed(2)}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => handleMoveToCart(item)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] shadow-xs transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

