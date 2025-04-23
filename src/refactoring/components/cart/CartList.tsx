import { useCartContext } from "../../contexts";
import { getAppliedDiscount } from "../../models/cart";
import { IncrementButton, DecrementButton } from "../";

const CartList = () => {
  const { cart, removeFromCart, updateQuantity } = useCartContext();

  return (
    <div>
      {cart.map((item) => {
        const appliedDiscount = getAppliedDiscount(item);
        return (
          <div
            key={item.product.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <div>
              <span className="font-semibold">{item.product.name}</span>
              <br />
              <span className="text-sm text-gray-600">
                {item.product.price}원 x {item.quantity}
                {appliedDiscount > 0 && (
                  <span className="text-green-600 ml-1">
                    ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
                  </span>
                )}
              </span>
            </div>
            <div>
              <DecrementButton
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
              />
              <IncrementButton
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
              />
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartList;
