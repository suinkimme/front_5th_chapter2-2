import { CartItem, Coupon, Product } from "../../types";

// utils
import { calculateTotalWithDiscount, caclulateTotalDiscount } from "../utils";

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const { totalBeforeDiscount, totalAfterDiscount } =
    calculateTotalWithDiscount(cart);
  const { totalAfterCouponDiscount, totalDiscount } = caclulateTotalDiscount(
    totalBeforeDiscount,
    totalAfterDiscount,
    selectedCoupon
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterCouponDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const findCartItemByProductId = (
  prevCart: CartItem[],
  productId: string
) => prevCart.find((item) => item.product.id === productId);

export const increaseCartItemQuantity = (
  prevCart: CartItem[],
  product: Product
) => {
  return prevCart.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
      : item
  );
};

export const addOrUpdateCartItem = (prevCart: CartItem[], product: Product) => {
  const existingItem = findCartItemByProductId(prevCart, product.id);
  if (existingItem) {
    return increaseCartItemQuantity(prevCart, product);
  }
  return [...prevCart, { product, quantity: 1 }];
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};
