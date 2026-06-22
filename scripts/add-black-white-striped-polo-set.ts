import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Black and White Striped Polo Set",
  price: 15000,
  category: "two-piece sets",
  sizes: ["S", "M", "L"],
  colors: ["Black/White"],
  images: ["/images/products/black-white-striped-polo-set.png"],
  description:
    "A casual black and white striped polo shirt paired with matching drawstring shorts. A relaxed, sporty two-piece set perfect for weekends, lounging, and casual outings.",
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
