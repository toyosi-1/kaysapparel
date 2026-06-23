import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { productService } from "../src/lib/firebase-services";

const newProducts = [
  {
    name: "Black Off-Shoulder Ball Gown",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    images: ["/images/products/black-off-shoulder-ball-gown.png"],
    description:
      "An elegant black off-shoulder ball gown with pearl embellishments scattered across the bodice and skirt. Features dramatic white sleeve details and a full A-line silhouette. Perfect for weddings, galas, and formal events.",
    inStock: true,
  },
  {
    name: "Teal Floral Mesh Maxi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Teal"],
    images: ["/images/products/teal-floral-mesh-maxi-dress.png"],
    description:
      "A stunning teal mesh maxi dress with a circle pattern bodice, long sleeves, chest cutout, and a vibrant floral hem. Fitted and figure-hugging with a slight train. Ideal for parties, red carpet events, and special occasions.",
    inStock: true,
  },
  {
    name: "Yellow Ombre Floral Jumpsuit",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Yellow"],
    images: ["/images/products/yellow-ombre-floral-jumpsuit.png"],
    description:
      "A vibrant yellow-to-green ombre pleated jumpsuit with floral ruffle waist detail, wide-leg pants, and colorful floral hem. Spaghetti strap with a relaxed flowy top. A bold statement piece for parties, celebrations, and events.",
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
