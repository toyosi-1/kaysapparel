const fs = require("fs");
const path = require("path");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kaysadmin2025";
const FUNCTION_URL = "https://frabjous-sfogliatella-fff3f2.netlify.app/.netlify/functions/admin-products";

const productDir = path.resolve(process.cwd(), "public/images/products");

const product = {
  id: "48",
  name: "Blue & White Striped One-Shoulder Midi Dress",
  price: 28000,
  category: "dresses",
  sizes: ["S", "M", "L"],
  colors: ["Blue/White"],
  description:
    "A stylish blue and white striped one-shoulder midi dress with a flattering fit. Elegant for brunch, beach outings, and semi-formal occasions.",
  inStock: true,
};

const images = [
  {
    name: "blue-white-striped-one-shoulder-midi-dress-front.png",
    path: path.resolve(productDir, "blue-white-striped-one-shoulder-midi-dress-front.png"),
  },
  {
    name: "blue-white-striped-one-shoulder-midi-dress-back.png",
    path: path.resolve(productDir, "blue-white-striped-one-shoulder-midi-dress-back.png"),
  },
];

function fileToBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function main() {
  console.log("Uploading images and creating product via Netlify function...");

  const payload = {
    action: "create",
    adminPassword: ADMIN_PASSWORD,
    product,
    images: images.map((img) => ({
      name: img.name,
      data: fileToBase64(img.path),
    })),
  };

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Upload failed:", data.error || response.statusText);
    process.exit(1);
  }

  console.log("Product uploaded successfully:", data);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
