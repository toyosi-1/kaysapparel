const fs = require('fs');
const path = require('path');

const imageDir = '/Users/kingtoy/Documents/E-commerce/kaysapparel/public/images/products';
const ADMIN_PASSWORD = 'kaysadmin2025';
const API_URL = 'https://kaysapparel.com/.netlify/functions/admin-products';

const products = [
  {
    name: 'Blue & White Striped Maxi Dress',
    price: 18000,
    category: 'dresses',
    sizes: ['M'],
    colors: ['Blue/White'],
    description: 'Elegant blue and white striped maxi dress with a flattering fit. Perfect for casual outings and special occasions.',
    imageFiles: [
      'blue-white-striped-maxi-dress-front.png',
      'blue-white-striped-maxi-dress-back.png',
    ],
  },
  {
    name: 'Mustard Lace Shirt Dress',
    price: 18000,
    category: 'dresses',
    sizes: ['M'],
    colors: ['Mustard'],
    description: 'Stylish mustard lace shirt dress featuring delicate lace details and a comfortable fit.',
    imageFiles: [
      'mustard-lace-shirt-dress-front.png',
      'mustard-lace-shirt-dress-back.png',
    ],
  },
  {
    name: 'Abstract Watercolor Print Blouse',
    price: 9000,
    category: 'tops',
    sizes: ['M'],
    colors: ['Multi'],
    description: 'Vibrant abstract watercolor print blouse with a unique artistic design.',
    imageFiles: [
      'abstract-watercolor-print-blouse-front.png',
      'abstract-watercolor-print-blouse-back.png',
    ],
  },
];

function fileToBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

async function createProduct(product) {
  const images = product.imageFiles.map((fileName) => {
    const filePath = path.join(imageDir, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Image not found: ${filePath}`);
    }
    return {
      name: fileName,
      data: fileToBase64(filePath),
    };
  });

  const payload = {
    action: 'create',
    adminPassword: ADMIN_PASSWORD,
    product: {
      name: product.name,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      description: product.description,
      inStock: true,
    },
    images,
  };

  console.log(`Uploading ${product.name}...`);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Failed to upload ${product.name}: ${data.error || response.statusText}`);
  }

  console.log(`Created: ${data.name} (${data.id})`);
  return data;
}

async function main() {
  const results = [];
  for (const product of products) {
    const result = await createProduct(product);
    results.push(result);
  }
  console.log('\nAll products uploaded successfully:');
  for (const result of results) {
    console.log(`- ${result.name} (${result.id})`);
  }
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
