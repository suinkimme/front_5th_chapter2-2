import { CartItem, Coupon, Product } from "../../types";

export const calculateItemTotal = (item: CartItem, discount: number): number =>
  item.product.price * item.quantity * (1 - discount);

export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts.reduce(
    (maxDiscount, d) =>
      item.quantity >= d.quantity && d.rate > maxDiscount
        ? d.rate
        : maxDiscount,
    0
  );

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;
    totalBeforeDiscount += price * quantity;

    const discount = getMaxApplicableDiscount(item);

    totalAfterDiscount += calculateItemTotal(item, discount);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
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
