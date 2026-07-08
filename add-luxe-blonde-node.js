const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8TQZpLzVqY3S4h5W7J9K0M1N2O3P4Q5R",
  authDomain: "kaysapparel-8.firebaseapp.com",
  projectId: "kaysapparel-8",
  storageBucket: "kaysapparel-8.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const product = {
  name: "Luxe Satin Halter Blouse",
  price: 900000, // ₦9,000 in kobo
  category: "Blouses",
  sizes: ["M", "L"],
  colors: "Beige, Ivory",
  description: "Elegant Luxe Satin Halter Blouse featuring a chic halter neckline with a tie-back closure. Crafted from smooth satin fabric with a flattering draped front and open-back design. Perfect for evening outings or special occasions.",
  images: [
    "https://frabjous-sfogliatella-fff3f2.netlify.app/images/products/Luxe%20Satin%20Halter%20Blouse%20front.png",
    "https://frabjous-sfogliatella-fff3f2.netlify.app/images/products/Luxe%20Satin%20Halter%20Blouse%20back.png"
  ],
  inStock: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

async function addProduct() {
  try {
    console.log('Adding Luxe Satin Halter Blouse to Firebase...');
    const docRef = await addDoc(collection(db, 'products'), product);
    console.log('✅ Product added successfully!');
    console.log('   ID:', docRef.id);
    console.log('   Name:', product.name);
    console.log('   Price:', product.price / 100, 'NGN');
    console.log('   Sizes:', product.sizes.join(', '));
    console.log('   Colors:', product.colors);
    console.log('   Images:', product.images.length, 'files');
    console.log('   Front:', product.images[0]);
    console.log('   Back:', product.images[1]);
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
}

addProduct();
