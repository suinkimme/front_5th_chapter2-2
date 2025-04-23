import { useState } from "react";
import { Coupon } from "../../types.ts";

export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
  };

  const createCoupon = () => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  const editNewCouponName = (newCoupon: Coupon, newName: string) => {
    setNewCoupon({ ...newCoupon, name: newName });
  };

  const editNewCouponCode = (newCoupon: Coupon, newCode: string) => {
    setNewCoupon({ ...newCoupon, code: newCode });
  };

  const editNewCouponDiscountType = (
    newCoupon: Coupon,
    newDiscountType: "amount" | "percentage"
  ) => {
    setNewCoupon({ ...newCoupon, discountType: newDiscountType });
  };

  const editNewCouponDiscountValue = (
    newCoupon: Coupon,
    newDiscountValue: number
  ) => {
    setNewCoupon({ ...newCoupon, discountValue: newDiscountValue });
  };

  return {
    coupons,
    newCoupon,
    addCoupon,
    createCoupon,
    editNewCouponName,
    editNewCouponCode,
    editNewCouponDiscountType,
    editNewCouponDiscountValue,
  };
};
