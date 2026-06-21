import { Product, Category } from "./types";

export const categories: Category[] = [
  { id: "1", name: "Dresses", slug: "dresses" },
  { id: "2", name: "Tops", slug: "tops" },
  { id: "3", name: "Skirts", slug: "skirts" },
  { id: "4", name: "Trousers", slug: "trousers" },
  { id: "5", name: "Shorts", slug: "shorts" },
  { id: "6", name: "Two-Piece Sets", slug: "two-piece-sets" },
  { id: "7", name: "Accessories", slug: "accessories" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Elegant Midi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Wine", "Navy"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&crop=top"],
    description:
      "A stunning midi dress perfect for both formal events and casual outings. Made with high-quality breathable fabric.",
    inStock: true,
  },
  {
    id: "2",
    name: "Ankara Print Blouse",
    price: 12000,
    category: "tops",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Multi-color", "Blue Print", "Red Print"],
    images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop&crop=top"],
    description:
      "Beautiful Ankara print blouse with modern styling. Pairs perfectly with jeans or skirts.",
    inStock: true,
  },
  {
    id: "3",
    name: "High-Waist Pencil Skirt",
    price: 10000,
    category: "skirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Brown"],
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop&crop=center"],
    description:
      "Classic high-waist pencil skirt for a professional and chic look. Stretchy and comfortable.",
    inStock: true,
  },
  {
    id: "4",
    name: "Wide-Leg Palazzo Pants",
    price: 15000,
    category: "trousers",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Olive"],
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop&crop=top"],
    description:
      "Flowing wide-leg pants that are both stylish and comfortable. Perfect for any occasion.",
    inStock: true,
  },
  {
    id: "5",
    name: "Lace Bodycon Dress",
    price: 22000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["White", "Black", "Burgundy"],
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop&crop=top"],
    description:
      "Stunning lace bodycon dress for special occasions. Elegant and figure-flattering.",
    inStock: true,
  },
  {
    id: "6",
    name: "Casual Denim Shorts",
    price: 8000,
    category: "shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop&crop=center"],
    description:
      "Comfortable and trendy denim shorts for everyday wear. High-quality denim fabric.",
    inStock: true,
  },
  {
    id: "7",
    name: "Crop Top & Skirt Set",
    price: 20000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Green", "Yellow"],
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&crop=top"],
    description:
      "Matching crop top and skirt set for a coordinated look. Perfect for parties and outings.",
    inStock: true,
  },
  {
    id: "8",
    name: "Off-Shoulder Top",
    price: 9500,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Red"],
    images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop&crop=top"],
    description:
      "Trendy off-shoulder top that flatters every body type. Soft, breathable material.",
    inStock: true,
  },
];

export const BANK_DETAILS = {
  bankName: "Sterling Bank",
  accountName: "Kaysapparel Global Concept",
  accountNumber: "0092419264",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
