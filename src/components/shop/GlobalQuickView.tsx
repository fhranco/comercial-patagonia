"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import ProductQuickView from "./ProductQuickView";

export default function GlobalQuickView() {
  const { quickViewProduct, setQuickViewProduct } = useCart();

  return (
    <ProductQuickView 
      product={quickViewProduct} 
      isOpen={!!quickViewProduct} 
      onClose={() => setQuickViewProduct(null)} 
    />
  );
}
