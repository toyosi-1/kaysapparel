import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProducts = [
  {
    name: "Tan Structured Handbag",
    price: 27000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Tan"],
    images: ["/images/products/tan-structured-handbag.png"],
    description:
      "A chic tan structured handbag with a top handle and minimalist design. Perfect for everyday use and stylish outings.",
    inStock: true,
  },
  {
    name: "Grey Chain Strap Handbag",
    price: 27000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Grey"],
    images: ["/images/products/grey-chain-strap-handbag.png"],
    description:
      "A sleek grey structured handbag with a silver chain strap and modern silhouette. Versatile for both casual and dressy occasions.",
    inStock: true,
  },
  {
    name: "Black and White Striped Handbag",
    price: 27000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-striped-handbag.png"],
    description:
      "A bold black and white striped handbag with a top handle and chain strap. A statement accessory for any outfit.",
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
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
}

addProducts();
