import { Product, Category } from './types'
import { products as staticProducts } from './data'

// Static categories
export const categories: Category[] = [
  { id: "1", name: "Accessories", slug: "accessories" },
  { id: "2", name: "Dresses", slug: "dresses" },
  { id: "3", name: "Shorts", slug: "shorts" },
  { id: "4", name: "Skirts", slug: "skirts" },
  { id: "5", name: "Tops", slug: "tops" },
  { id: "6", name: "Trousers", slug: "trousers" },
  { id: "7", name: "Two-Piece Sets", slug: "two-piece-sets" },
]

export const BANK_DETAILS = {
  bankName: "Moniepoint MFB",
  accountName: "Kaysapparel Global Concept",
  accountNumber: "5439334220",
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

// Static product functions — no external calls, no promises
export function getProducts(): Product[] {
  return staticProducts
}

export function getProductsByCategory(category: string): Product[] {
  return staticProducts.filter(p => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return staticProducts.find(p => p.id === id)
}
