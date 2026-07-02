import { Product, Category } from "./types";

export const categories: Category[] = [
  { id: "1", name: "Accessories", slug: "accessories" },
  { id: "2", name: "Dresses", slug: "dresses" },
  { id: "3", name: "Shorts", slug: "shorts" },
  { id: "4", name: "Skirts", slug: "skirts" },
  { id: "5", name: "Tops", slug: "tops" },
  { id: "6", name: "Trousers", slug: "trousers" },
  { id: "7", name: "Two-Piece Sets", slug: "two-piece-sets" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Beige Tailored Wide-Leg Trouser",
    price: 15000,
    category: "trousers",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige"],
    images: ["/images/products/beige-tailored-wide-leg-trouser.webp"],
    description:
      "A sophisticated beige tailored wide-leg trouser with a clean silhouette. Comfortable and polished for work, church, and smart-casual occasions.",
    inStock: true,
  },
  {
    id: "2",
    name: "Cream Striped Patchwork Shirt",
    price: 10000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "White"],
    images: ["/images/products/cream-striped-patchwork-shirt.webp"],
    description:
      "A relaxed cream striped patchwork shirt with a unique mixed-print design. A stylish pick for casual Fridays and weekend outings.",
    inStock: true,
  },
  {
    id: "9",
    name: "Black & White Button Collar Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-button-collar-midi-dress.webp"],
    description:
      "A chic sleeveless black midi dress with a white Peter Pan collar trim, button-front detail, and contrast pocket outlines. A polished choice for work, church, and semi-formal events.",
    inStock: true,
  },
  {
    id: "10",
    name: "Black & White Contrast Sleeve Midi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-contrast-sleeve-midi-dress.webp"],
    description:
      "A sophisticated black midi dress with voluminous white bishop sleeves. The clean contrast and modest silhouette make it perfect for office wear, church, and elegant daytime occasions.",
    inStock: true,
  },
  {
    id: "11",
    name: "Mauve Lace Pleated Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Mauve"],
    images: ["/images/products/mauve-lace-pleated-midi-dress.webp"],
    description:
      "A graceful mauve midi dress with a crochet-lace bodice, flared pleated sleeves, and a sunburst pleated skirt. Feminine and refined for weddings, dinners, and special gatherings.",
    inStock: true,
  },
  {
    id: "12",
    name: "Floral Chiffon Crop Top & Skirt Set",
    price: 12000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    images: ["/images/products/floral-chiffon-crop-top-skirt-set.webp"],
    description:
      "A vibrant floral chiffon two-piece set featuring a square-neck long-sleeve crop top and a matching tiered ruffle mini skirt. Bold and breezy for vacations, parties, and sunny outings.",
    inStock: true,
  },
  {
    id: "13",
    name: "Blue & White Striped Kaftan Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue/White"],
    images: ["/images/products/blue-white-striped-kaftan-dress.webp"],
    description:
      "A relaxed blue and white striped kaftan maxi dress with a deep V-neck, wide sleeves, and front drawstring ties. Effortlessly stylish for beach days, resort wear, and casual errands.",
    inStock: true,
  },
  {
    id: "14",
    name: "Black Chiffon Overlay Maxi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    images: ["/images/products/black-chiffon-overlay-maxi-dress.webp"],
    description:
      "A flowing black chiffon overlay maxi dress with elegant draping and a lightweight feel. Perfect for evening events, dinners, and special occasions.",
    inStock: true,
  },
  {
    id: "15",
    name: "Black Multicolor Floral Maxi Skirt",
    price: 12000,
    category: "skirts",
    sizes: ["S", "M", "L"],
    colors: ["Black/Multicolor"],
    images: ["/images/products/black-multicolor-floral-maxi-skirt.webp"],
    description:
      "A bold black maxi skirt featuring a vibrant multicolor floral print. Comfortable and eye-catching for parties, vacations, and statement styling.",
    inStock: true,
  },
  {
    id: "16",
    name: "Blue Gold Abstract Wrap Maxi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue/Gold"],
    images: ["/images/products/blue-gold-abstract-wrap-maxi-dress.webp"],
    description:
      "A stunning blue and gold abstract wrap maxi dress with a flattering silhouette. Ideal for formal gatherings, weddings, and elegant outings.",
    inStock: true,
  },
  {
    id: "17",
    name: "Beige Rainbow Fringe Knit Sweater",
    price: 12000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Beige/Rainbow"],
    images: ["/images/products/beige-rainbow-fringe-knit-sweater.webp"],
    description:
      "A cozy beige knit sweater with playful rainbow fringe details. A fun and stylish pick for casual days, chilly evenings, and relaxed outings.",
    inStock: true,
  },
  {
    id: "18",
    name: "Teal Velvet Maxi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Teal"],
    images: ["/images/products/teal-velvet-maxi-dress.webp"],
    description:
      "A rich teal velvet maxi dress with a soft, luxurious feel. Elegant for dinners, parties, and special occasions.",
    inStock: true,
  },
  {
    id: "19",
    name: "Navy Pink Floral Maxi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Navy/Pink"],
    images: ["/images/products/navy-pink-floral-maxi-dress.webp"],
    description:
      "A graceful navy maxi dress with a pink floral print. Flowing and feminine for weddings, outings, and formal events.",
    inStock: true,
  },
  {
    id: "20",
    name: "Grey Satin Mermaid Midi Skirt",
    price: 12000,
    category: "skirts",
    sizes: ["S", "M", "L"],
    colors: ["Grey"],
    images: ["/images/products/grey-satin-mermaid-midi-skirt.webp"],
    description:
      "A sleek grey satin mermaid midi skirt with a flattering silhouette. Perfect for evening wear and chic styling.",
    inStock: true,
  },
  {
    id: "21",
    name: "Green Silk Blouse",
    price: 12000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Green"],
    images: ["/images/products/green-silk-blouse.webp"],
    description:
      "A elegant green silk blouse with a soft, flowing drape. A refined choice for work, dinners, and casual elegance.",
    inStock: true,
  },
  {
    id: "22",
    name: "Abstract Print Green Skirt Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Green/Multicolor"],
    images: ["/images/products/abstract-print-green-skirt-dress.webp"],
    description:
      "A stylish green abstract print dress with a flattering skirt silhouette. Perfect for daytime events and casual elegance.",
    inStock: true,
  },
  {
    id: "23",
    name: "Abstract Print Pant Set",
    price: 15000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    images: ["/images/products/abstract-print-pant-set.webp"],
    description:
      "A bold abstract print two-piece set with matching pants. Comfortable and statement-making for parties and outings.",
    inStock: true,
  },
  {
    id: "24",
    name: "Abstract Print Pleated Skirt Set",
    price: 15000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    images: ["/images/products/abstract-print-pleated-skirt-set.webp"],
    description:
      "A coordinated abstract print top and pleated skirt set. Feminine and polished for special occasions and gatherings.",
    inStock: true,
  },
  {
    id: "25",
    name: "Black Off-Shoulder Ball Gown",
    price: 20000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    images: ["/images/products/black-off-shoulder-ball-gown.webp"],
    description:
      "A dramatic black off-shoulder ball gown with a voluminous skirt. The ultimate choice for gala nights, weddings, and formal celebrations.",
    inStock: true,
  },
  {
    id: "26",
    name: "Black Rhinestone Mesh Midi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Black"],
    images: ["/images/products/black-rhinestone-mesh-midi-dress.webp"],
    description:
      "A glamorous black mesh midi dress with rhinestone embellishments. Perfect for evening parties, dinners, and red-carpet moments.",
    inStock: true,
  },
  {
    id: "27",
    name: "Black & White Striped Handbag",
    price: 12000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-striped-handbag.webp"],
    description:
      "A chic black and white striped handbag with structured shape. A stylish accessory to complete any outfit.",
    inStock: true,
  },
  {
    id: "28",
    name: "Black & White Striped Polo Set",
    price: 15000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Black/White"],
    images: ["/images/products/black-white-striped-polo-set.webp"],
    description:
      "A matching black and white striped polo top and bottom set. Sporty yet elegant for casual and semi-formal settings.",
    inStock: true,
  },
  {
    id: "29",
    name: "Blue Mesh Ruffle Maxi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue"],
    images: ["/images/products/blue-mesh-ruffle-maxi-dress.webp"],
    description:
      "A flowing blue mesh maxi dress with delicate ruffle details. Elegant for weddings, dinners, and summer events.",
    inStock: true,
  },
  {
    id: "30",
    name: "Brown Wave Print Maxi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Brown/Multicolor"],
    images: ["/images/products/brown-wave-print-maxi-dress.webp"],
    description:
      "A relaxed brown wave print maxi dress with effortless movement. Ideal for vacations, beach days, and casual outings.",
    inStock: true,
  },
  {
    id: "31",
    name: "Cream Floral Chiffon Midi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Cream/Floral"],
    images: ["/images/products/cream-floral-chiffon-midi-dress.webp"],
    description:
      "A romantic cream chiffon midi dress with a soft floral print. Light and airy for brunches, garden parties, and daytime events.",
    inStock: true,
  },
  {
    id: "32",
    name: "Cream Striped Belted Midi Dress",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Cream"],
    images: ["/images/products/cream-striped-belted-midi-dress.webp"],
    description:
      "A refined cream striped midi dress with a waist belt. Polished and flattering for work, church, and elegant outings.",
    inStock: true,
  },
  {
    id: "33",
    name: "Floral Ruffle Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    images: ["/images/products/floral-ruffle-dress.webp"],
    description:
      "A cheerful floral ruffle dress with playful tiered details. A lovely pick for parties, vacations, and sunny days.",
    inStock: true,
  },
  {
    id: "34",
    name: "Grey Chain Strap Handbag",
    price: 12000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Grey"],
    images: ["/images/products/grey-chain-strap-handbag.webp"],
    description:
      "A sleek grey handbag with a chain strap detail. A versatile accessory that elevates both casual and formal looks.",
    inStock: true,
  },
  {
    id: "35",
    name: "Grey Ribbed Polo Midi Dress",
    price: 12000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Grey"],
    images: ["/images/products/grey-ribbed-polo-midi-dress.webp"],
    description:
      "A fitted grey ribbed polo midi dress with a collar detail. Smart and sporty for everyday wear and casual Fridays.",
    inStock: true,
  },
  {
    id: "36",
    name: "Mixed Print Kaftan",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multicolor"],
    images: ["/images/products/mixed-print-kaftan.webp"],
    description:
      "A relaxed mixed-print kaftan with wide sleeves and a flowing cut. Perfect for resort wear, Fridays, and effortless style.",
    inStock: true,
  },
  {
    id: "37",
    name: "Pink Stripe Oversized Shirt Set",
    price: 15000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Pink/White"],
    images: ["/images/products/pink-stripe-oversized-shirt-set.webp"],
    description:
      "A breezy pink striped oversized shirt set with matching bottoms. Comfortable and stylish for casual outings and travel.",
    inStock: true,
  },
  {
    id: "38",
    name: "Pink Striped Polo Top",
    price: 9000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Pink/White"],
    images: ["/images/products/pink-striped-polo-top.webp"],
    description:
      "A preppy pink striped polo top with a classic collar. Great for casual days paired with jeans or skirts.",
    inStock: true,
  },
  {
    id: "39",
    name: "Pinstripe Bell Sleeve Blouse",
    price: 10000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Pinstripe"],
    images: ["/images/products/pinstripe-bell-sleeve-blouse.webp"],
    description:
      "A chic pinstripe blouse with dramatic bell sleeves. A polished choice for office wear and smart-casual occasions.",
    inStock: true,
  },
  {
    id: "40",
    name: "Red Layered Pinstripe Collar Top",
    price: 10000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Red"],
    images: ["/images/products/red-layered-pinstripe-collar-top.webp"],
    description:
      "A bold red layered top with pinstripe collar details. Eye-catching and modern for work, church, and evening events.",
    inStock: true,
  },
  {
    id: "41",
    name: "Red Teal Abstract Skirt Set",
    price: 15000,
    category: "two-piece-sets",
    sizes: ["S", "M", "L"],
    colors: ["Red/Teal"],
    images: ["/images/products/red-teal-abstract-skirt-set.webp"],
    description:
      "A vibrant red and teal abstract print skirt set. Matching top and skirt for a coordinated, standout look.",
    inStock: true,
  },
  {
    id: "42",
    name: "Rust Beaded Shoulder Blouse",
    price: 12000,
    category: "tops",
    sizes: ["S", "M", "L"],
    colors: ["Rust"],
    images: ["/images/products/rust-beaded-shoulder-blouse.webp"],
    description:
      "A warm rust blouse with delicate beaded shoulder details. Elegant for dinners, parties, and cultural celebrations.",
    inStock: true,
  },
  {
    id: "43",
    name: "Tan Structured Handbag",
    price: 12000,
    category: "accessories",
    sizes: ["One Size"],
    colors: ["Tan"],
    images: ["/images/products/tan-structured-handbag.webp"],
    description:
      "A classic tan structured handbag with clean lines. A timeless accessory that pairs with almost any outfit.",
    inStock: true,
  },
  {
    id: "44",
    name: "Teal Double Breasted Midi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Teal"],
    images: ["/images/products/teal-double-breasted-midi-dress.webp"],
    description:
      "A sophisticated teal double-breasted midi dress with a tailored silhouette. Perfect for office, church, and formal events.",
    inStock: true,
  },
  {
    id: "45",
    name: "Teal Floral Mesh Maxi Dress",
    price: 18000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Teal/Floral"],
    images: ["/images/products/teal-floral-mesh-maxi-dress.webp"],
    description:
      "A dreamy teal floral mesh maxi dress with soft draping. Ideal for weddings, evening events, and elegant occasions.",
    inStock: true,
  },
  {
    id: "46",
    name: "Yellow Kaftan Gold Brooch Dress",
    price: 20000,
    category: "dresses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow/Gold"],
    images: ["/images/products/yellow-kaftan-gold-brooch-dress.webp"],
    description:
      "A stunning yellow kaftan dress with a gold brooch accent. Regal and perfect for celebrations, weddings, and special events.",
    inStock: true,
  },
  {
    id: "47",
    name: "Yellow Ombre Floral Jumpsuit",
    price: 15000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Yellow/Ombre"],
    images: ["/images/products/yellow-ombre-floral-jumpsuit.webp"],
    description:
      "A bright yellow ombre floral jumpsuit with a relaxed fit. Bold and breezy for parties, vacations, and summer days.",
    inStock: true,
  },
  {
    id: "48",
    name: "Blue & White Striped One-Shoulder Midi Dress",
    price: 28000,
    category: "dresses",
    sizes: ["S", "M", "L"],
    colors: ["Blue/White"],
    images: [
      "/images/products/blue-white-striped-one-shoulder-midi-dress-front.png",
      "/images/products/blue-white-striped-one-shoulder-midi-dress-back.png",
    ],
    description:
      "A stylish blue and white striped one-shoulder midi dress with a flattering fit. Elegant for brunch, beach outings, and semi-formal occasions.",
    inStock: true,
  },
];

export const BANK_DETAILS = {
  bankName: "Moniepoint MFB",
  accountName: "Kaysapparel Global Concept",
  accountNumber: "5439334220",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
