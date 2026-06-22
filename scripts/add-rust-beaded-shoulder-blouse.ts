import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Rust Beaded Shoulder Blouse",
  price: 8000,
  category: "tops",
  sizes: ["S", "M", "L"],
  colors: ["Rust"],
  images: ["/images/products/rust-beaded-shoulder-blouse.png"],
  description:
    "A rust-colored blouse with dramatic puff sleeves, elegant pearl bead shoulder details, and a button-front finish. A refined choice for work, church, or stylish daytime events.",
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
