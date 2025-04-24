// useCart.ts
import { useState } from "react";
import { CartItem, Coupon, Product, Grade } from "../../types";
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
  const [grade, setGrade] = useState<Grade[]>([
    { name: "VIP", discountRate: 10 },
    { name: "골드", discountRate: 7 },
    { name: "실버", discountRate: 5 },
    { name: "일반", discountRate: 3 },
  ]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const addGrade = (grade: Grade) => {
    setGrade((prevGrade) => [...prevGrade, grade]);
  };

  const selectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
  };

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

  const calculateTotal = () =>
    calculateCartTotal(cart, selectedCoupon, selectedGrade);

  return {
    cart,
    grade,
    selectedCoupon,
    selectedGrade,
    handleAddToCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    addGrade,
    selectGrade,
  };
};
