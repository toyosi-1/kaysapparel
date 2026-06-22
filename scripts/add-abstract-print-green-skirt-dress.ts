import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Abstract Print Green Skirt Dress",
  price: 18000,
  category: "dresses",
  sizes: ["S", "M", "L"],
  colors: ["Multi Print"],
  images: ["/images/products/abstract-print-green-skirt-dress.png"],
  description:
    "A knee-length dress with an abstract multicolor print bodice, mandarin collar, 3/4 sleeves, and a pleated green skirt with buttoned pockets. Elegant for work, church, and formal daytime events.",
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
