export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  options: string[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: ProductImage[];
  categories: { id: number; name: string; slug: string }[];
  attributes: ProductAttribute[];
}

export interface CartItem extends Product {
  quantity: number;
}
