"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem } from "@/types/woocommerce";

interface SavedQuote {
  id: string;
  date: string;
  projectName: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  quoteHistory: SavedQuote[];
  saveQuoteToHistory: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [projectName, setProjectName] = useState("");
  const [quoteHistory, setQuoteHistory] = useState<SavedQuote[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Recovery - Hydration safe for React 19
  useEffect(() => {
    const savedCart = localStorage.getItem("patagonia_cart");
    const savedProject = localStorage.getItem("patagonia_project_name");
    const savedHistory = localStorage.getItem("patagonia_history");
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) { console.error(e); }
    }
    
    if (savedProject) setProjectName(savedProject);

    if (savedHistory) {
      try {
        setQuoteHistory(JSON.parse(savedHistory));
      } catch (e) { console.error(e); }
    }
    
    setIsHydrated(true);
  }, []);

  // Save changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("patagonia_cart", JSON.stringify(cart));
      localStorage.setItem("patagonia_project_name", projectName);
      localStorage.setItem("patagonia_history", JSON.stringify(quoteHistory));
    }
  }, [cart, projectName, quoteHistory, isHydrated]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setProjectName("");
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const saveQuoteToHistory = useCallback(() => {
    if (cart.length === 0) return;
    
    const newQuote: SavedQuote = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      projectName: projectName || "Proyecto General",
      items: [...cart],
      total: cartTotal
    };

    setQuoteHistory(prev => [newQuote, ...prev]);
  }, [cart, projectName, cartTotal]);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, cartTotal, isCartOpen, setIsCartOpen,
      projectName, setProjectName, quoteHistory, saveQuoteToHistory, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
