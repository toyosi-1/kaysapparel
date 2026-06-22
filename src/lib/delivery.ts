/**
 * Delivery pricing and location zones for KaysApparel
 * Lagos, Nigeria delivery structure
 */

export type DeliveryZone =
  | "mainland"
  | "outskirts-mainland"
  | "island"
  | "ajah-environs";

export interface DeliveryZoneInfo {
  id: DeliveryZone;
  label: string;
  price: number;
  rangeLabel: string;
  description: string;
}

// Delivery zones and their fixed prices (in Naira)
export const DELIVERY_ZONES: DeliveryZoneInfo[] = [
  {
    id: "mainland",
    label: "Mainland",
    price: 5000,
    rangeLabel: "₦5,000",
    description: "Ikeja, Yaba, Surulere, Oshodi, Maryland, Ikeja GRA, etc.",
  },
  {
    id: "outskirts-mainland",
    label: "Outskirts of Mainland",
    price: 7000,
    rangeLabel: "₦7,000 - ₦9,000",
    description: "Egbeda, Iyana Ipaja, Agege, Abule Egba, etc. (Far areas may attract ₦9,000)",
  },
  {
    id: "island",
    label: "Island",
    price: 5000,
    rangeLabel: "₦5,000",
    description: "Victoria Island, Ikoyi, Lekki Phase 1, Oniru, etc.",
  },
  {
    id: "ajah-environs",
    label: "Ajah and Environs",
    price: 7000,
    rangeLabel: "₦7,000 - ₦9,000",
    description: "Ajah, Sangotedo, Awoyaya, Lakowe, etc. (Far areas may attract ₦9,000)",
  },
];

// Base price for each zone (default)
export const BASE_DELIVERY_PRICE: Record<DeliveryZone, number> = {
  mainland: 5000,
  "outskirts-mainland": 7000,
  island: 5000,
  "ajah-environs": 7000,
};

// Maximum delivery price for each zone (for far areas)
export const MAX_DELIVERY_PRICE: Record<DeliveryZone, number> = {
  mainland: 5000,
  "outskirts-mainland": 9000,
  island: 5000,
  "ajah-environs": 9000,
};

/**
 * Get delivery price for a zone
 */
export function getDeliveryPrice(zone: DeliveryZone): number {
  return BASE_DELIVERY_PRICE[zone] || 5000;
}

/**
 * Get delivery zone info by ID
 */
export function getDeliveryZoneInfo(zone: DeliveryZone): DeliveryZoneInfo | undefined {
  return DELIVERY_ZONES.find((z) => z.id === zone);
}

/**
 * Format delivery price range for display
 */
export function formatDeliveryRange(zone: DeliveryZone): string {
  const base = BASE_DELIVERY_PRICE[zone];
  const max = MAX_DELIVERY_PRICE[zone];

  if (base === max) {
    return `₦${base.toLocaleString()}`;
  }

  return `₦${base.toLocaleString()} - ₦${max.toLocaleString()}`;
}

/**
 * Standard clothing prices by category (in Naira)
 */
export const STANDARD_PRODUCT_PRICES: Record<string, number> = {
  gowns: 12000,
  dresses: 12000,
  tops: 8000,
};

/**
 * Get standard price for a product category
 */
export function getStandardPrice(category: string): number | undefined {
  const normalizedCategory = category.toLowerCase().trim();
  return STANDARD_PRODUCT_PRICES[normalizedCategory];
}

/**
 * Check if a category has a standard price
 */
export function hasStandardPrice(category: string): boolean {
  return getStandardPrice(category) !== undefined;
}

/**
 * Suggest price based on product category
 */
export function suggestPrice(category: string, currentPrice?: number): number {
  const standardPrice = getStandardPrice(category);
  return standardPrice ?? currentPrice ?? 0;
}

/**
 * Calculate order total including delivery fee
 */
export function calculateOrderTotal(
  subtotal: number,
  deliveryZone: DeliveryZone
): { subtotal: number; deliveryFee: number; total: number } {
  const deliveryFee = getDeliveryPrice(deliveryZone);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

/**
 * List of specific Lagos locations for delivery zone reference
 */
export const LOCATION_REFERENCES: Record<DeliveryZone, string[]> = {
  mainland: [
    "Ikeja",
    "Yaba",
    "Surulere",
    "Oshodi",
    "Maryland",
    "Ikeja GRA",
    "Ogba",
    "Magodo",
    "Gbagada",
    "Ketu",
  ],
  "outskirts-mainland": [
    "Egbeda",
    "Iyana Ipaja",
    "Agege",
    "Abule Egba",
    "Alimosho",
    "Ipaja",
    "Dopemu",
    "Akowonjo",
    "Idimu",
    "Isheri",
  ],
  island: [
    "Victoria Island",
    "Ikoyi",
    "Lekki Phase 1",
    "Oniru",
    "Banana Island",
    "Parkview",
    "Maroko",
  ],
  "ajah-environs": [
    "Ajah",
    "Sangotedo",
    "Awoyaya",
    "Lakowe",
    "Badore",
    "Ilaje",
    "Lekki Phase 2",
    "Abraham Adesanya",
    "Thomas Estate",
  ],
};

/**
 * Validate a delivery zone value
 */
export function isValidDeliveryZone(zone: string): zone is DeliveryZone {
  return DELIVERY_ZONES.some((z) => z.id === zone);
}
