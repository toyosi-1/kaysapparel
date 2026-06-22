import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Mixed Print Kaftan Dress",
  price: 32000,
  category: "dresses",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Mixed Print"],
  images: ["/images/products/mixed-print-kaftan.png"],
  description:
    "A relaxed-fit, full-length kaftan dress featuring bold mixed stripes and check prints in red, blue, green, and monochrome. Designed with a collared neckline, button placket, and side pockets for effortless elegance. Perfect for casual outings, weekend events, and dressy daytime occasions.",
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
