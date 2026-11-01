import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync with backend when authenticated
  useEffect(() => {
    async function fetchBackendWishlist() {
      if (isAuthenticated) {
        try {
          const res = await wishlistApi.get();
          if (res.wishlist) {
            setWishlistItems(res.wishlist);
          }
        } catch (err) {
          console.warn('Could not fetch backend wishlist:', err.message);
        }
      }
    }
    fetchBackendWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (product) => {
    const exists = isInWishlist(product.product_id);

    if (exists) {
      if (isAuthenticated) {
        try {
          await wishlistApi.remove(product.product_id);
        } catch (e) {}
      }
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== product.product_id));
    } else {
      if (isAuthenticated) {
        try {
          await wishlistApi.add(product.product_id);
        } catch (e) {}
      }
      setWishlistItems((prev) => [
        ...prev,
        {
          product_id: product.product_id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          original_price: product.original_price,
          image_url: product.image_url,
          brand: product.brand || product.brand_generated,
          stock_quantity: product.stock_quantity,
          avg_rating: product.avg_rating,
          review_count: product.review_count,
        },
      ]);
    }
  };

  const moveToCart = async (product) => {
    await addToCart(product, 1);
    await toggleWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

