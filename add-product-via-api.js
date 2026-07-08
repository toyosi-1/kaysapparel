// Add product via Netlify admin API instead of direct Firebase
const product = {
  name: "Luxe Satin Halter Blouse",
  price: 9000, // ₦9,000
  category: "Blouses",
  sizes: ["M", "L"],
  colors: "Beige, Ivory",
  description: "Elegant Luxe Satin Halter Blouse featuring a chic halter neckline with a tie-back closure. Crafted from smooth satin fabric with a flattering draped front and open-back design. Perfect for evening outings or special occasions.",
  images: [
    "https://frabjous-sfogliatella-fff3f2.netlify.app/images/products/Luxe%20Satin%20Halter%20Blouse%20front.png",
    "https://frabjous-sfogliatella-fff3f2.netlify.app/images/products/Luxe%20Satin%20Halter%20Blouse%20back.png"
  ],
  inStock: true
};

async function addProductViaAPI() {
  try {
    console.log('Adding Luxe Satin Halter Blouse via admin API...');
    
    const response = await fetch('https://frabjous-sfogliatella-fff3f2.netlify.app/.netlify/functions/admin-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Password': 'Olatoyosi1' // Use super admin password
      },
      body: JSON.stringify({
        action: 'create',
        product: product,
        images: product.images.map((url, index) => ({
          name: index === 0 ? 'Luxe Satin Halter Blouse front.png' : 'Luxe Satin Halter Blouse back.png',
          data: url // Since images are already hosted, pass URLs directly
        }))
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Product added successfully!');
    console.log('   Response:', result);
    console.log('   Name:', product.name);
    console.log('   Price:', product.price, 'NGN');
    console.log('   Sizes:', product.sizes.join(', '));
    console.log('   Colors:', product.colors);
    console.log('   Images:', product.images.length, 'files');
    console.log('   Front:', product.images[0]);
    console.log('   Back:', product.images[1]);
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
}

addProductViaAPI();
