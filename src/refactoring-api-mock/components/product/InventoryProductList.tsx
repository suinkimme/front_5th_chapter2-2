import { useProductContext } from "../../contexts";

import { InventoryProductItem } from ".";

const InventoryProductList = () => {
  const { products } = useProductContext();

  return (
    <div className="space-y-2">
      {products.map((product) => {
        return <InventoryProductItem key={product.id} product={product} />;
      })}
    </div>
  );
};

export default InventoryProductList;
