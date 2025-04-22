// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  addOrUpdateCartItem,
  updateCartItemQuantity,
  calculateCartTotal,
} from "../models/cart";

const filteredCartItemByProductId = (prevCart: CartItem[], productId: string) =>
  prevCart.filter((item) => item.product.id !== productId);

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    setCart((prevCart) => addOrUpdateCartItem(prevCart, product));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => filteredCartItemByProductId(prevCart, productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

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
