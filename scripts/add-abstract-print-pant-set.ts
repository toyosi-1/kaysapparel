import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProduct = {
  name: "Abstract Print Pant Set",
  price: 18000,
  category: "two-piece sets",
  sizes: ["S", "M", "L"],
  colors: ["Pink Abstract"],
  images: ["/images/products/abstract-print-pant-set.png"],
  description:
    "A coordinated two-piece set featuring a pink abstract print button-up shirt with matching relaxed-fit pants. Stylish and comfortable for casual outings, loungewear, or dressed-down events.",
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
