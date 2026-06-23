import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types/types';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addToCart: (
    product: Product,
    quantity: number,
    size: 'small' | 'medium' | 'large',
    sugar: 0 | 25 | 50 | 100,
    ice: 'none' | 'normal' | 'extra',
    extras: string[]
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shabar_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart storage', e);
      }
    }
  }, []);

  // Save cart to storage on change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const calculateItemPrice = (
    product: Product,
    size: 'small' | 'medium' | 'large',
    extras: string[]
  ): number => {
    let price = product.price;

    // Apply size modifier
    const sizeOpt = product.availableSizes.find(s => s.name === size);
    if (sizeOpt) {
      price += sizeOpt.priceModifier;
    }

    // Apply extras pricing
    extras.forEach(extraName => {
      const extraOpt = product.availableExtras.find(e => e.name === extraName);
      if (extraOpt) {
        price += extraOpt.price;
      }
    });

    return price;
  };

  const addToCart = (
    product: Product,
    quantity: number,
    size: 'small' | 'medium' | 'large',
    sugar: 0 | 25 | 50 | 100,
    ice: 'none' | 'normal' | 'extra',
    extras: string[]
  ) => {
    // Generate unique ID based on selections
    const extrasKey = [...extras].sort().join(',');
    const cartItemId = `${product.id}_${size}_${sugar}_${ice}_${extrasKey}`;

    const existingIndex = cart.findIndex(item => item.id === cartItemId);
    const customizedPrice = calculateItemPrice(product, size, extras);

    let newCart = [...cart];

    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        id: cartItemId,
        product,
        quantity,
        selectedSize: size,
        selectedSugar: sugar,
        selectedIce: ice,
        selectedExtras: extras,
        customizedPrice
      });
    }

    saveCart(newCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter(item => item.id !== cartItemId);
    saveCart(newCart);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const newCart = cart.map(item => 
      item.id === cartItemId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Derived values
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.customizedPrice * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 10 : 0; // Flat 10 EGP delivery fee if cart is not empty
  const total = subtotal + deliveryFee;

  const value = {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
