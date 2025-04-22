import { CartItem, Product } from "../../types";

// utils
import { getCartItem } from "./";

export const isOutOfStock = (remainingStock: number) => remainingStock <= 0;

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = getCartItem(cart, product);
  return product.stock - (cartItem?.quantity || 0);
};
