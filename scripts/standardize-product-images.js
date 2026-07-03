const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const productDir = path.resolve(process.cwd(), "public/images/products");
const targetWidth = 1200;
const targetHeight = 1800;

const images = [
  {
    input: "blue-white-striped-one-shoulder-midi-dress-front.png",
    output: "blue-white-striped-one-shoulder-midi-dress-front.png",
  },
  {
    input: "blue-white-striped-one-shoulder-midi-dress-back.png",
    output: "blue-white-striped-one-shoulder-midi-dress-back.png",
  },
];

async function standardize({ input, output }) {
  const inputPath = path.resolve(productDir, input);
  const outputPath = path.resolve(productDir, output);

  await sharp(inputPath)
    .resize(targetWidth, targetHeight, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: false,
    })
    .toFile(outputPath + ".tmp");

  fs.renameSync(outputPath + ".tmp", outputPath);
  const metadata = await sharp(outputPath).metadata();
  console.log(`Standardized ${input} -> ${output} (${metadata.width}x${metadata.height})`);
}

async function main() {
  for (const img of images) {
    await standardize(img);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
