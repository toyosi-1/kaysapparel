require('dotenv').config({ path: '/Users/kingtoy/Documents/E-commerce/kaysapparel/.env.local' });
const fs = require('fs');
const path = require('path');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountJson);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: serviceAccount.project_id + '.firebasestorage.app',
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

const imageDir = '/Users/kingtoy/Documents/E-commerce/kaysapparel/public/images/products';

const products = [
  {
    name: 'Blue & White Striped Maxi Dress',
    price: 18000,
    category: 'dresses',
    sizes: ['M'],
    colors: ['Blue/White'],
    description: 'Elegant blue and white striped maxi dress with a flattering fit. Perfect for casual outings and special occasions.',
    images: [
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
    images: [
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
    images: [
      'abstract-watercolor-print-blouse-front.png',
      'abstract-watercolor-print-blouse-back.png',
    ],
  },
];

async function uploadImage(filePath, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
  const buffer = fs.readFileSync(filePath);
  const storagePath = `products/${Date.now()}_${fileName}`;
  const file = bucket.file(storagePath);
  await file.save(buffer, {
    metadata: { contentType },
  });
  const [url] = await file.getSignedUrl({ action: 'read', expires: '03-01-2500' });
  return url;
}

async function createProduct(product) {
  const imageUrls = [];
  for (const imageName of product.images) {
    const filePath = path.join(imageDir, imageName);
    if (!fs.existsSync(filePath)) {
      console.error(`Image not found: ${filePath}`);
      process.exit(1);
    }
    console.log(`Uploading ${imageName}...`);
    const url = await uploadImage(filePath, imageName);
    imageUrls.push(url);
    console.log(`Uploaded: ${url}`);
  }

  const now = FieldValue.serverTimestamp();
  const docData = {
    name: product.name,
    price: product.price,
    category: product.category,
    sizes: product.sizes,
    colors: product.colors,
    images: imageUrls,
    description: product.description,
    inStock: true,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = db.collection('products').doc();
  await docRef.set(docData);
  const doc = await docRef.get();
  console.log(`Created product: ${docRef.id} - ${product.name}`);
  return { id: docRef.id, ...doc.data() };
}

async function main() {
  const results = [];
  for (const product of products) {
    const result = await createProduct(product);
    results.push(result);
  }
  console.log('\nAll products uploaded successfully:');
  for (const result of results) {
    console.log(`- ${result.name} (${result.id}): ${result.images.length} images`);
  }
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
