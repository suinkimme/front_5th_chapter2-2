import { CartItem, Coupon, Product, Grade } from "../../types";

/**
 * Product
 */
export const isOutOfStock = (remainingStock: number) => remainingStock <= 0;

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = getCartItem(cart, product);
  return product.stock - (cartItem?.quantity || 0);
};

export const getCartItem = (cart: CartItem[], product: Product) => {
  return cart.find((item) => item.product.id === product.id);
};

/**
 * Cart
 */
export const findCartItemByProductId = (
  prevCart: CartItem[],
  productId: string
) => prevCart.find((item) => item.product.id === productId);

export const filteredCartItemByProductId = (
  prevCart: CartItem[],
  productId: string
) => prevCart.filter((item) => item.product.id !== productId);

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

export const calculateCartItemTotal = (item: CartItem) => {
  const discount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - discount);
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
  selectedGrade: Grade | null
) => {
  const { totalBeforeDiscount, totalAfterDiscount } =
    calculateTotalWithDiscount(cart);
  const { totalAfterGradeDiscount, totalDiscount } = caclulateTotalDiscount(
    totalBeforeDiscount,
    totalAfterDiscount,
    selectedCoupon,
    selectedGrade
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterGradeDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

/**
 * Discount
 */
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
  selectedCoupon: Coupon | null,
  selectedGrade: Grade | null
) => {
  const totalAfterCouponDiscount = selectedCoupon
    ? selectedCoupon.discountType === "amount"
      ? Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
      : totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
    : totalAfterDiscount;

  const totalAfterGradeDiscount = selectedGrade
    ? totalAfterCouponDiscount * (1 - selectedGrade.discountRate / 100)
    : totalAfterCouponDiscount;

  const totalDiscount = totalBeforeDiscount - totalAfterGradeDiscount;

  return {
    totalAfterGradeDiscount,
    totalDiscount,
  };
};
