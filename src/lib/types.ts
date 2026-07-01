export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  inStock: boolean;
  _isStatic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: "pending" | "payment_received" | "shipped" | "delivered";
  receiptUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
