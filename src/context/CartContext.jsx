import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/marketplace.service';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadCart();
    } else {
      setCart({ items: [], total: 0 });
      setLoading(false);
    }
  }, [currentUser]);

  const loadCart = async () => {
    setLoading(true);
    const userCart = await cartService.getCart(currentUser.uid);
    setCart(userCart);
    setLoading(false);
  };

  const addToCart = async (productId, quantity, size, color) => {
    const result = await cartService.addToCart(currentUser.uid, productId, quantity, size, color);
    if (result.success) {
      setCart(result.cart);
    }
    return result;
  };

  const updateQuantity = async (productId, quantity, size, color) => {
    const result = await cartService.updateCartItem(currentUser.uid, productId, quantity, size, color);
    if (result.success) {
      setCart(result.cart);
    }
    return result;
  };

  const removeItem = async (productId, size, color) => {
    const result = await cartService.removeFromCart(currentUser.uid, productId, size, color);
    if (result.success) {
      setCart(result.cart);
    }
    return result;
  };

  const clearCart = async () => {
    const result = await cartService.clearCart(currentUser.uid);
    if (result.success) {
      setCart({ items: [], total: 0 });
    }
    return result;
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};