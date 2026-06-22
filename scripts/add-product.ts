import { productService } from '../src/lib/firebase-services'

const newProduct = {
  name: "Floral Ruffle Dress",
  price: 12000,
  category: "dresses",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Cream Floral"],
  images: ["/images/products/floral-ruffle-dress.png"],
  description: "Elegant cold-shoulder floral ruffle dress with a flowing asymmetric hem. Perfect for weddings, brunch, and special occasions.",
  inStock: true,
}

async function addProduct() {
  console.log('➕ Adding new product to Firebase...')

  try {
    const existing = await productService.getAll()
    const duplicate = existing.find(p => p.name?.toLowerCase() === newProduct.name.toLowerCase())

    if (duplicate) {
      console.log(`⚠️ Product "${newProduct.name}" already exists. Skipping.`)
      return
    }

    const product = await productService.create(newProduct)
    console.log(`✅ Added product: ${newProduct.name} (ID: ${product.id})`)
  } catch (error) {
    console.error('❌ Error adding product:', error)
    process.exit(1)
  }
}

addProduct()
