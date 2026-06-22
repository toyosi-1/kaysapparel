import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Abstract Print Pleated Skirt Set",
  price: 20000,
  category: "two-piece sets",
  sizes: ["S", "M", "L"],
  colors: ["Multi Print"],
  images: ["/images/products/abstract-print-pleated-skirt-set.png"],
  description:
    "A vibrant two-piece set featuring a colorful abstract print top paired with a flowing green pleated skirt. Bold, artistic, and perfect for making a statement at daytime events, brunches, and celebrations.",
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
