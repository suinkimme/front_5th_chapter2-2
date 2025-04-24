import { Discount } from "../../../types";

import { getMaxDiscount } from "../../models/cart";

type InventoryProductStockWithDiscountProps = {
  remainingStock: number;
  discounts: Discount[];
};

const InventoryProductStockWithDiscount = ({
  remainingStock,
  discounts,
}: InventoryProductStockWithDiscountProps) => {
  return (
    <div className="text-sm text-gray-500 mb-2">
      <span
        className={`font-medium ${
          remainingStock > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        재고: {remainingStock}개
      </span>
      {discounts.length > 0 && (
        <span className="ml-2 font-medium text-blue-600">
          최대 {(getMaxDiscount(discounts) * 100).toFixed(0)}% 할인
        </span>
      )}
    </div>
  );
};

export default InventoryProductStockWithDiscount;
