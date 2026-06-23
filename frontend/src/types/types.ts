export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string; // 'juices' | 'cocktails' | 'cold-coffee' | 'specials'
  price: number; // base price for Medium size
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isSpecial?: boolean;
  availableSizes: {
    name: 'small' | 'medium' | 'large';
    label: string;
    priceModifier: number; // added price
  }[];
  availableSugar: {
    value: 0 | 25 | 50 | 100;
    label: string;
  }[];
  availableIce: {
    value: 'none' | 'normal' | 'extra';
    label: string;
  }[];
  availableExtras: {
    name: string;
    label: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string; // unique cart item id (combines product.id + options hash)
  product: Product;
  quantity: number;
  selectedSize: 'small' | 'medium' | 'large';
  selectedSugar: 0 | 25 | 50 | 100;
  selectedIce: 'none' | 'normal' | 'extra';
  selectedExtras: string[]; // array of extra names
  customizedPrice: number; // single item price after customization
}

export type OrderStatus = 'received' | 'preparing' | 'delivering' | 'completed';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  done: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'online';
  createdAt: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  description: string;
}
