import { createContext, useContext, ReactNode } from "react";
import { Coupon } from "../../types";

// hooks
import { useCoupons } from "../hooks";

type CouponContextType = ReturnType<typeof useCoupons>;

const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider = ({
  children,
  coupons,
}: {
  children: ReactNode;
  coupons: Coupon[];
}) => {
  const value = useCoupons(coupons);

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCouponContext muest be used within CouponProvider");
  }
  return context;
};
