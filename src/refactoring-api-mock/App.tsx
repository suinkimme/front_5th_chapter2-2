import {
  ProductProvider,
  CouponProvider,
  AuthProvider,
  CartProvider,
} from "./contexts/index.ts";

import { Navigation, Content } from "./components/index.ts";

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CouponProvider>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <CartProvider>
              <Content />
            </CartProvider>
          </div>
        </CouponProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
