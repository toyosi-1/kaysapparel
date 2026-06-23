import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Black Rhinestone Mesh Midi Dress",
  price: 25000,
  category: "dresses",
  sizes: ["S", "M", "L"],
  colors: ["Black"],
  images: ["/images/products/black-rhinestone-mesh-midi-dress.png"],
  description:
    "A sleek black bodycon midi dress with a rhinestone-embellished mesh neckline, sheer long sleeves, and a thigh-high side slit. The perfect choice for parties, dinner dates, and evening events.",
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
