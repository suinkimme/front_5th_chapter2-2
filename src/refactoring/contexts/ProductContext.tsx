import { createContext, useContext, ReactNode } from "react";
import { Product } from "../../types";

// hooks
import { useProducts } from "../hooks";

type ProductContextType = ReturnType<typeof useProducts>;

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) => {
  const value = useProducts(products);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext muest be used within ProductProvider");
  }
  return context;
};
