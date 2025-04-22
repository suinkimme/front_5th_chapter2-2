import { CartItem, Coupon, Product } from "../../types";

// CartPage.js에 있는 getMaxDiscount로 계산 함수 분리해도 좋을 것 같음
export const calculateItemTotal = (item: CartItem) => {
  const discount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - discount);
};

export const calculateTotalWithDiscount = (cart: CartItem[]) => {
  const totalBeforeDiscount = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalAfterDiscount = cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
  };
};

export const getMaxApplicableDiscount = (item: CartItem) =>
  item.product.discounts.reduce(
    (maxDiscount, d) =>
      item.quantity >= d.quantity && d.rate > maxDiscount
        ? d.rate
        : maxDiscount,
    0
  );

export const caclulateTotalDiscount = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon
) =>
  selectedCoupon.discountType === "amount"
    ? Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    : totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const { totalBeforeDiscount, totalAfterDiscount } =
    calculateTotalWithDiscount(cart);
  const totalDiscount = selectedCoupon
    ? caclulateTotalDiscount(totalAfterDiscount, selectedCoupon)
    : totalBeforeDiscount - totalAfterDiscount;

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
