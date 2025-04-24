import { useState, useEffect } from "react";
import { Coupon } from "../../types.ts";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  });

  const createCoupon = (newCoupon: Coupon) => {
    addCoupon(newCoupon);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    });
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
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

  useEffect(() => {
    fetch("/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data));
  }, []);

  return {
    coupons,
    newCoupon,
    createCoupon,
    addCoupon,
    editNewCouponName,
    editNewCouponCode,
    editNewCouponDiscountType,
    editNewCouponDiscountValue,
  };
};
