import {
  SectionTitle,
  InventoryProductList,
  CouponSection,
  CartTotalSection,
  InventoryHistorySection,
} from "../";
import { useCartContext } from "../../contexts";

const CartContent = () => {
  const { grade, selectedGrade, selectGrade } = useCartContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <SectionTitle>상품 목록</SectionTitle>
        <InventoryProductList />
        <div className="flex flex-row gap-2">
          {grade.map((item) => (
            <div key={item.name}>
              <input
                type="radio"
                name="grade"
                id={item.name}
                checked={selectedGrade?.name === item.name}
                onChange={() => selectGrade(item)}
              />
              <label htmlFor={item.name}>{item.name}</label>
            </div>
          ))}
        </div>
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
