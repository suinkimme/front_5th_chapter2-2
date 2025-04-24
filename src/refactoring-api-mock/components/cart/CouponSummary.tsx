import { useCartContext } from "../../contexts";

const CouponSummary = () => {
  const { selectedCoupon } = useCartContext();
  if (!selectedCoupon) return null;

  return (
    <p className="text-green-600">
      적용된 쿠폰: {selectedCoupon.name}(
      {selectedCoupon.discountType === "amount"
        ? `${selectedCoupon.discountValue}원`
        : `${selectedCoupon.discountValue}%`}{" "}
      할인)
    </p>
  );
};

export default CouponSummary;
