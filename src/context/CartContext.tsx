'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (item: CartItem) => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.color.hex === newItem.color.hex
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.color.hex === newItem.color.hex
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      }
      return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const removeFromCart = (itemToRemove: CartItem) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === itemToRemove.product.id &&
            item.size === itemToRemove.size &&
            item.color.hex === itemToRemove.color.hex
          )
      )
    );
  };

  const updateQuantity = (itemToUpdate: CartItem, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === itemToUpdate.product.id &&
        item.size === itemToUpdate.size &&
        item.color.hex === itemToUpdate.color.hex
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const value = { items, addToCart, removeFromCart, updateQuantity, clearCart, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
