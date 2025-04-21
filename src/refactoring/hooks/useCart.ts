// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "../models/cart";

const findCartItemByProductId = (prevCart: CartItem[], productId: string) =>
  prevCart.find((item) => item.product.id === productId);

const increaseCartItemQuantity = (prevCart: CartItem[], product: Product) => {
  return prevCart.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
      : item
  );
};

const addOrUpdateCartItem = (prevCart: CartItem[], product: Product) => {
  const existingItem = findCartItemByProductId(prevCart, product.id);
  if (existingItem) {
    return increaseCartItemQuantity(prevCart, product);
  }
  return [...prevCart, { product, quantity: 1 }];
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCart((prevCart) => addOrUpdateCartItem(prevCart, product));
  };

  const removeFromCart = (productId: string) => {};

  const updateQuantity = (productId: string, newQuantity: number) => {};

  const applyCoupon = (coupon: Coupon) => {};

  const calculateTotal = () => ({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  });

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
