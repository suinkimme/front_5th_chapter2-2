// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product } from "../../types";
import {
  addOrUpdateCartItem,
  updateCartItemQuantity,
  calculateCartTotal,
  filteredCartItemByProductId,
  getRemainingStock,
  isOutOfStock,
} from "../models/cart";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const handleAddToCart = (cart: CartItem[], product: Product) => {
    const remainingStock = getRemainingStock(cart, product);
    if (isOutOfStock(remainingStock)) return;

    addToCart(product);
  };

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
    handleAddToCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
