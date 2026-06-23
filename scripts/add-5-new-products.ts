import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProducts = [
  {
    name: "Cream Floral Chiffon Midi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Cream"],
    images: ["/images/products/cream-floral-chiffon-midi-dress.png"],
    description:
      "A romantic cream chiffon midi dress with delicate pink floral print, flutter sleeves, a high neck, and a flowing A-line skirt. Perfect for weddings, bridal events, and garden parties.",
    inStock: true,
  },
  {
    name: "Blue Mesh Ruffle Maxi Dress",
    price: 22000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue"],
    images: ["/images/products/blue-mesh-ruffle-maxi-dress.png"],
    description:
      "A full-length periwinkle blue mesh maxi dress with sheer long sleeves, ruched bodice, and elegant diagonal ruffle detail. Flattering and feminine for formal events and special occasions.",
    inStock: true,
  },
  {
    name: "Brown Wave Print Maxi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Brown/Cream"],
    images: ["/images/products/brown-wave-print-maxi-dress.png"],
    description:
      "A sleek brown and cream wave-print bodycon maxi dress with a high neck and long sleeves. The bold swirl pattern creates a striking silhouette — ideal for parties, date nights, and events.",
    inStock: true,
  },
  {
    name: "Pink Striped Polo Top",
    price: 8000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Pink/White"],
    images: ["/images/products/pink-striped-polo-top.png"],
    description:
      "A fitted pink and white striped long-sleeve polo top with a white collar and open V-neckline. Casual yet stylish for everyday wear, outings, and relaxed occasions.",
    inStock: true,
  },
  {
    name: "Red Layered Pinstripe Collar Top",
    price: 12000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Red/Blue"],
    images: ["/images/products/red-layered-pinstripe-collar-top.png"],
    description:
      "A bold red long-sleeve top with a layered blue pinstripe shirt collar and button detail. A smart-casual piece that pairs well with jeans, trousers, or skirts.",
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
