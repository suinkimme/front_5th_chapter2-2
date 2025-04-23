type InventoryProductTitleProps = {
  name: string;
  price: number;
};

const InventoryProductTitle = ({ name, price }: InventoryProductTitleProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">{name}</span>
      <span className="text-gray-600">{price.toLocaleString()}원</span>
    </div>
  );
};

export default InventoryProductTitle;
