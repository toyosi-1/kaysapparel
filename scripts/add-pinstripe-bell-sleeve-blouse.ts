import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Pinstripe Bell Sleeve Blouse",
  price: 8000,
  category: "tops",
  sizes: ["S", "M", "L"],
  colors: ["White/Blue"],
  images: ["/images/products/pinstripe-bell-sleeve-blouse.png"],
  description:
    "A white and blue pinstripe blouse with a wrap-style V-neck, peplum waist, and dramatic bell sleeves. Elegant for work, church, or dressy daytime occasions.",
  inStock: true,
};

async function addProduct() {
  try {
    const existing = await productService.getAll();
    const duplicate = existing.find(
      (p) => p.name?.toLowerCase() === newProduct.name.toLowerCase()
    );

    if (duplicate) {
      console.log(`⚠️ Product "${newProduct.name}" already exists. Skipping.`);
      return;
    }

    const product = await productService.create(newProduct);
    console.log(`✅ Added product: ${newProduct.name} (ID: ${product.id})`);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    process.exit(1);
  }
}

addProduct();
