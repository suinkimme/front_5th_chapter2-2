import { CartItem, Coupon } from "../../types";

// utils
import { calculateCartItemTotal } from "./";

export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[]
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};

export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts.reduce(
    (maxDiscount, d) =>
      item.quantity >= d.quantity && d.rate > maxDiscount
        ? d.rate
        : maxDiscount,
    0
  );

export const calculateTotalWithDiscount = (cart: CartItem[]) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalAfterDiscount = cart.reduce(
    (total, item) => total + calculateCartItemTotal(item),
    0
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
  };
};

export const caclulateTotalDiscount = (
  totalBeforeDiscount: number,
  totalAfterDiscount: number,
  selectedCoupon: Coupon | null
) => {
  const totalAfterCouponDiscount = selectedCoupon
    ? selectedCoupon.discountType === "amount"
      ? Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
      : totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
    : totalAfterDiscount;

  const totalDiscount = totalBeforeDiscount - totalAfterCouponDiscount;

  return {
    totalAfterCouponDiscount,
    totalDiscount,
  };
};
