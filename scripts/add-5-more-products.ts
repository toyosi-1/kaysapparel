import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProducts = [
  {
    name: "Grey Ribbed Polo Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Grey"],
    images: ["/images/products/grey-ribbed-polo-midi-dress.png"],
    description:
      "A fitted grey ribbed polo midi dress with a button collar neckline and drawstring waist belt. Sleek and casual yet put-together — ideal for outings, brunch, and everyday wear.",
    inStock: true,
  },
  {
    name: "Pink Stripe Oversized Shirt Set",
    price: 12000,
    category: "two-piece sets",
    sizes: ["S", "M", "L"],
    colors: ["Pink"],
    images: ["/images/products/pink-stripe-oversized-shirt-set.png"],
    description:
      "A relaxed multicolor pink striped oversized shirt paired with matching pink mini shorts. A fun and breezy two-piece set perfect for casual outings, vacations, and weekend looks.",
    inStock: true,
  },
  {
    name: "Cream Striped Belted Midi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Cream/Blue"],
    images: ["/images/products/cream-striped-belted-midi-dress.png"],
    description:
      "An elegant cream and blue striped button-down midi dress with a mandarin collar, 3/4 sleeves, self-tie waist belt, and tiered skirt. A classic feminine style for work, church, and special events.",
    inStock: true,
  },
  {
    name: "Red Teal Abstract Skirt Set",
    price: 12000,
    category: "two-piece sets",
    sizes: ["S", "M", "L"],
    colors: ["Red/Teal"],
    images: ["/images/products/red-teal-abstract-skirt-set.png"],
    description:
      "A bold red and teal abstract print two-piece set featuring a ruched long-sleeve crop top and a matching mini skirt. Eye-catching and figure-flattering for parties, events, and night outs.",
    inStock: true,
  },
  {
    name: "Yellow Kaftan Gold Brooch Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Yellow"],
    images: ["/images/products/yellow-kaftan-gold-brooch-dress.png"],
    description:
      "A flowing yellow kaftan maxi dress with a deep V-neckline, wide sleeves, and a gold sunburst brooch cinching the center. Effortlessly elegant for events, owambes, and formal occasions.",
    inStock: true,
  },
];

async function addProducts() {
  try {
    const existing = await productService.getAll();

    for (const newProduct of newProducts) {
      const duplicate = existing.find(
        (p) => p.name?.toLowerCase() === newProduct.name.toLowerCase()
      );

      if (duplicate) {
        console.log(`⚠️ Product "${newProduct.name}" already exists. Skipping.`);
        continue;
      }

      const product = await productService.create(newProduct);
      console.log(`✅ Added product: ${newProduct.name} (ID: ${product.id})`);
    }

    console.log("\n🎉 All done!");
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
}

addProducts();
