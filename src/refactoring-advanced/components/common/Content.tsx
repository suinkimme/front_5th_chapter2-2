import { AdminPage, CartPage } from "../../pages";
import { useAuthContext } from "../../contexts";

const Content = () => {
  const { isAdmin } = useAuthContext();

  return (
    <main className="container mx-auto mt-6">
      {isAdmin ? <AdminPage /> : <CartPage />}
    </main>
  );
};

export default Content;
