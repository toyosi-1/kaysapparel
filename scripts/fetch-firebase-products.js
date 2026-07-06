const ADMIN_PASSWORD = 'kaysadmin2025';
const API_URL = 'https://kaysapparel.com/.netlify/functions/admin-products';

async function main() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getProducts', adminPassword: ADMIN_PASSWORD }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const products = await response.json();
  const targetIds = ['QWM7SFO1OHyjCRrcSseM', 'PBcWIB0r3OLq8SsRLuDQ', 'QxYZ9Zz8dsfEx4gpRmLs'];
  const filtered = products.filter((p) => targetIds.includes(p.id));
  console.log(JSON.stringify(filtered, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
