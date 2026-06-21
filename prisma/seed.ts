import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaLibSQL()
const prisma = new PrismaClient({
  adapter,
})

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

async function main() {
  console.log('Start seeding...')
  
  // Clear existing products
  await prisma.product.deleteMany()
  
  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        price: product.price, // Already in kobo
        category: product.category,
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        images: JSON.stringify(product.images),
        description: product.description,
        inStock: product.inStock,
      },
    })
  }
  
  console.log(`Seeded ${products.length} products`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
