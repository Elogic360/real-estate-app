import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Plot, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (plot: Plot) => void;
  removeFromCart: (plotId: string) => void;
  clearCart: () => void;
  isInCart: (plotId: string) => boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (plot: Plot) => {
    if (!isInCart(plot.id)) {
      setItems(prev => [...prev, { plot, addedAt: new Date() }]);
    }
  };

  const removeFromCart = (plotId: string) => {
    setItems(prev => prev.filter(item => item.plot.id !== plotId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (plotId: string) => {
    return items.some(item => item.plot.id === plotId);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.plot.price, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};