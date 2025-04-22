import { CartItem, Product } from "../../types";

// utils
import { getMaxApplicableDiscount } from "./";

export const filteredCartItemByProductId = (
  prevCart: CartItem[],
  productId: string
) => prevCart.filter((item) => item.product.id !== productId);

export const getCartItem = (cart: CartItem[], product: Product) => {
  return cart.find((item) => item.product.id === product.id);
};

export const calculateCartItemTotal = (item: CartItem) => {
  const discount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - discount);
};
