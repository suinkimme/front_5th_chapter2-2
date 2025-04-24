import { useCouponContext } from "../../contexts/CouponContext";
import { useCartContext } from "../../contexts/CartContext";

import { SectionTitle, SelectBox, CouponSummary } from "..";

const CouponSection = () => {
  const { coupons } = useCouponContext();
  const { applyCoupon } = useCartContext();

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <SectionTitle>쿠폰 적용</SectionTitle>
      <SelectBox
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        placeholder="쿠폰 선택"
        options={coupons.map((coupon, index) => ({
          value: index,
          label: `${coupon.name} - ${
            coupon.discountType === "amount"
              ? `${coupon.discountValue}원`
              : `${coupon.discountValue}%`
          }`,
        }))}
      />
      <CouponSummary />
    </div>
  );
};

export default CouponSection;
