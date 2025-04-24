import { Product } from "../../../types";
import { useCartContext } from "../../contexts";

import { getRemainingStock } from "../../models/cart";

import {
  InventoryProductTitle,
  InventoryProductStockWithDiscount,
  InventoryProductDiscountList,
} from ".";

import { Button } from "../common";

interface InventoryProductItemProps {
  product: Product;
}

const InventoryProductItem = ({ product }: InventoryProductItemProps) => {
  const { cart, handleAddToCart } = useCartContext();

  const remainingStock = getRemainingStock(cart, product);

  const { id, name, price, discounts } = product;

  return (
    <div data-testid={`product-${id}`} className="bg-white p-3 rounded shadow">
      <InventoryProductTitle name={name} price={price} />
      <InventoryProductStockWithDiscount
        remainingStock={remainingStock}
        discounts={discounts}
      />
      <InventoryProductDiscountList discounts={discounts} />
      <Button
        onClick={() => handleAddToCart(cart, product)}
        disabled={remainingStock <= 0}
      >
        {remainingStock > 0 ? "장바구니에 추가" : "품절"}
      </Button>
    </div>
  );
};

export default InventoryProductItem;
