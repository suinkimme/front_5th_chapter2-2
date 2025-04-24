import { createContext, useContext, ReactNode } from "react";

// hooks
import { useProducts } from "../hooks";

type ProductContextType = ReturnType<typeof useProducts>;

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const value = useProducts();

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
