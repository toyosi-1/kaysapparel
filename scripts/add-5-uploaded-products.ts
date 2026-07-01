import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
config({ path: resolve(projectRoot, ".env.local") });

const newProducts = [
  {
    name: "Black & White Button Collar Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-button-collar-midi-dress.png"],
    description:
      "A chic sleeveless black midi dress with a white Peter Pan collar trim, button-front detail, and contrast pocket outlines. A polished choice for work, church, and semi-formal events.",
    inStock: true,
  },
  {
    name: "Black & White Contrast Sleeve Midi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-contrast-sleeve-midi-dress.png"],
    description:
      "A sophisticated black midi dress with voluminous white bishop sleeves. The clean contrast and modest silhouette make it perfect for office wear, church, and elegant daytime occasions.",
    inStock: true,
  },
  {
    name: "Mauve Lace Pleated Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Mauve"],
    images: ["/images/products/mauve-lace-pleated-midi-dress.png"],
    description:
      "A graceful mauve midi dress with a crochet-lace bodice, flared pleated sleeves, and a sunburst pleated skirt. Feminine and refined for weddings, dinners, and special gatherings.",
    inStock: true,
  },
  {
    name: "Floral Chiffon Crop Top & Skirt Set",
    price: 12000,
    category: "two-piece sets",
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    images: ["/images/products/floral-chiffon-crop-top-skirt-set.png"],
    description:
      "A vibrant floral chiffon two-piece set featuring a square-neck long-sleeve crop top and a matching tiered ruffle mini skirt. Bold and breezy for vacations, parties, and sunny outings.",
    inStock: true,
  },
  {
    name: "Blue & White Striped Kaftan Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue/White"],
    images: ["/images/products/blue-white-striped-kaftan-dress.png"],
    description:
      "A relaxed blue and white striped kaftan maxi dress with a deep V-neck, wide sleeves, and front drawstring ties. Effortlessly stylish for beach days, resort wear, and casual errands.",
    inStock: true,
  },
];

import("../src/lib/firebase-services").then(async ({ productService }) => {
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

    console.log("\n🎉 All done!");
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
});
