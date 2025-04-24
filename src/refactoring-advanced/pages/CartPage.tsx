import { PageTitle, CartContent } from "../components";

export const CartPage = () => {
  return (
    <div className="container mx-auto p-4">
      <PageTitle>장바구니</PageTitle>
      <CartContent />
    </div>
  );
};
