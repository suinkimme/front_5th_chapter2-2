import { createContext, useContext, ReactNode } from "react";

// hooks
import { useCoupons } from "../hooks";

type CouponContextType = ReturnType<typeof useCoupons>;

const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const value = useCoupons();

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
