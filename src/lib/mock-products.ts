
import { Product } from "@/types/woocommerce";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Cemento Comodoro PCR - Bolsa 50kg",
    slug: "cemento-comodoro-pcr-50kg",
    permalink: "#",
    price: "8500",
    regular_price: "9500",
    sale_price: "8500",
    on_sale: true,
    stock_status: "instock",
    images: [{ id: 1, src: "/images/comodoro-2000.png", name: "Cemento Comodoro", alt: "Bolsa de Cemento Comodoro" }],
    categories: [{ id: 1, name: "Construcción", slug: "construccion" }],
    sku: "CM-PCR-50",
    description: "Cemento Portland de alta resistencia, ideal para estructuras de hormigón armado y obras civiles en la Patagonia.",
    short_description: "Solidez Comodoro para tus proyectos.",
    attributes: []
  },
  {
    id: 102,
    name: "Fierro Construcción 12mm x 6m",
    slug: "fierro-construccion-12mm-6m",
    permalink: "#",
    price: "12400",
    regular_price: "12400",
    sale_price: "",
    on_sale: false,
    stock_status: "instock",
    images: [{ id: 2, src: "/images/industrial-pro.webp", name: "Fierro 12mm", alt: "Barras de fierro de 12mm" }],
    categories: [{ id: 1, name: "Industrial", slug: "industrial" }],
    sku: "FI-12-6",
    description: "Barras de acero para refuerzo de hormigón, calidad certificada.",
    short_description: "Calidad industrial para Magallanes.",
    attributes: []
  },
  {
    id: 103,
    name: "Porcelanato Luxury Grey 60x60",
    slug: "porcelanato-luxury-grey-60x60",
    permalink: "#",
    price: "24900",
    regular_price: "29900",
    sale_price: "24900",
    on_sale: true,
    stock_status: "instock",
    images: [{ id: 3, src: "/images/luxury-home.webp", name: "Porcelanato Grey", alt: "Porcelanato Luxury Grey 60x60" }],
    categories: [{ id: 2, name: "Hogar", slug: "hogar" }],
    sku: "PORC-LX-G",
    description: "Revestimiento premium para ambientes modernos y elegantes.",
    short_description: "Estética y durabilidad.",
    attributes: []
  }
];
