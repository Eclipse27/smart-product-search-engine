import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync with backend when authenticated
  useEffect(() => {
    async function fetchBackendCart() {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const res = await cartApi.get();
          if (res.items) {
            setCartItems(res.items);
          }
        } catch (err) {
          console.warn('Could not fetch backend cart:', err.message);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchBackendCart();
  }, [isAuthenticated]);

  // Persist guest cart to localStorage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1);

    if (isAuthenticated) {
      try {
        await cartApi.add(product.product_id, qty);
        const res = await cartApi.get();
        setCartItems(res.items || []);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    } else {
      // Guest cart state update
      setCartItems((prev) => {
        const existingIdx = prev.findIndex((item) => item.product_id === product.product_id);
        if (existingIdx > -1) {
          const updated = [...prev];
          const newQty = Math.min(updated[existingIdx].quantity + qty, product.stock_quantity || 99);
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            subtotal: (newQty * parseFloat(product.price)).toFixed(2),
          };
          return updated;
        } else {
          return [
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
              quantity: qty,
              subtotal: (qty * parseFloat(product.price)).toFixed(2),
            },
          ];
        }
      });
    }
    setIsCartOpen(true);
  };

  const updateQuantity = async (productId, quantity) => {
    const newQty = parseInt(quantity);
    if (newQty <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        await cartApi.update(productId, newQty);
        const res = await cartApi.get();
        setCartItems(res.items || []);
      } catch (err) {
        console.error('Failed to update cart quantity:', err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.product_id === productId) {
            const cappedQty = Math.min(newQty, item.stock_quantity || 99);
            return {
              ...item,
              quantity: cappedQty,
              subtotal: (cappedQty * parseFloat(item.price)).toFixed(2),
            };
          }
          return item;
        })
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartApi.remove(productId);
        const res = await cartApi.get();
        setCartItems(res.items || []);
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clear();
      } catch (e) {}
    }
    setCartItems([]);
    localStorage.removeItem('aura_cart');
  };

  const itemCount = cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.subtotal || item.price * item.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

