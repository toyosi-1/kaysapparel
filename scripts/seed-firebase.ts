import { productService } from '../src/lib/firebase-services'

const products = [
  {
    id: "1",
    name: "Elegant Midi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Wine", "Navy"],
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop&crop=top"],
    description: "A stunning midi dress perfect for both formal events and casual outings. Made with high-quality breathable fabric.",
    inStock: true,
  },
  {
    id: "2",
    name: "Classic White Shirt",
    price: 8500,
    category: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&crop=top"],
    description: "A timeless white shirt that's a wardrobe essential. Perfect for office and casual wear.",
    inStock: true,
  },
  {
    id: "3",
    name: "Denim Shorts",
    price: 6500,
    category: "shorts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "White"],
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop&crop=top"],
    description: "Comfortable denim shorts for casual summer days. High-quality fabric that lasts.",
    inStock: true,
  },
  {
    id: "4",
    name: "Floral Summer Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Floral", "Pink", "Yellow"],
    images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop&crop=top"],
    description: "Beautiful floral dress perfect for summer occasions and beach outings.",
    inStock: true,
  },
  {
    id: "5",
    name: "Casual T-Shirt",
    price: 4500,
    category: "t-shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&crop=top"],
    description: "Comfortable cotton t-shirt for everyday wear. Soft and breathable fabric.",
    inStock: true,
  },
  {
    id: "6",
    name: "Business Suit",
    price: 35000,
    category: "suits",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=top"],
    description: "Professional business suit for important meetings and formal events.",
    inStock: true,
  }
]

async function seedDatabase() {
  console.log('🌱 Starting Firebase seed...')
  
  try {
    // Get existing products
    const existingProducts = await productService.getAll()
    console.log(`Found ${existingProducts.length} existing products`)
    
    // Clear existing products (optional - comment out if you want to keep existing data)
    for (const product of existingProducts) {
      if (product.id) {
        await productService.delete(product.id)
      }
    }
    console.log('Cleared existing products')
    
    // Add new products
    for (const product of products) {
      const { id, ...productData } = product
      await productService.create(productData)
      console.log(`✅ Added product: ${product.name}`)
    }
    
    console.log(`\n🎉 Successfully seeded ${products.length} products to Firebase!`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seed function
seedDatabase()
