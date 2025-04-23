import {
  SectionTitle,
  InventoryProductList,
  CouponSection,
  CartTotalSection,
  InventoryHistorySection,
} from "../";

const CartContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>상품 목록</SectionTitle>
        <InventoryProductList />
      </div>
      <div>
        <InventoryHistorySection />
        <CouponSection />
        <CartTotalSection />
      </div>
    </div>
  );
};

export default CartContent;
