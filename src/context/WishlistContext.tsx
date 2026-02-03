'use client';

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { getAllProducts } from '@/lib/placeholder-data';

interface WishlistContextType {
  wishlist: string[];
  products: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const allProducts = useMemo(() => getAllProducts(), []);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => [...prev, product.id]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };
  
  const products = useMemo(() => {
    return allProducts.filter(p => wishlist.includes(p.id));
  }, [wishlist, allProducts]);

  const value = { wishlist, products, addToWishlist, removeFromWishlist, isWishlisted };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
