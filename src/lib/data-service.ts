import { productService } from './firebase-services'
import { Product, Category } from './types'

// Static categories (can be moved to Firebase later if needed)
export const categories: Category[] = [
  { id: "1", name: "Dresses", slug: "dresses" },
  { id: "2", name: "Tops", slug: "tops" },
  { id: "3", name: "Skirts", slug: "skirts" },
  { id: "4", name: "Trousers", slug: "trousers" },
  { id: "5", name: "Shorts", slug: "shorts" },
  { id: "6", name: "Two-Piece Sets", slug: "two-piece-sets" },
  { id: "7", name: "Accessories", slug: "accessories" },
]

export const BANK_DETAILS = {
  bankName: "Sterling Bank",
  accountName: "Kaysapparel Global Concept",
  accountNumber: "0092419264",
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price)
}

// Firebase-based product functions
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await productService.getAll()
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      description: p.description,
      inStock: p.inStock
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return empty array if Firebase is not configured
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await productService.getByCategory(category)
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      description: p.description,
      inStock: p.inStock
    }))
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const product = await productService.getById(id)
    if (!product) return undefined
    
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      description: product.description,
      inStock: product.inStock
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return undefined
  }
}
