import { useState } from "react";
import { Product, Discount } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const updateProduct = (product: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((item) => (item.id === product.id ? product : item))
    );
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const editProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const productNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  const priceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  const editComplete = () => {
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const stockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const addDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const removeDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const editNewDiscountQuantity = (
    newDiscount: Discount,
    newQuantity: number
  ) => {
    setNewDiscount({
      ...newDiscount,
      quantity: newQuantity,
    });
  };

  const editNewDiscountRate = (newDiscount: Discount, newRate: number) => {
    setNewDiscount({
      ...newDiscount,
      rate: newRate,
    });
  };

  return {
    products,
    openProductIds,
    editingProduct,
    newDiscount,
    updateProduct,
    addProduct,
    toggleProductAccordion,
    editProduct,
    productNameUpdate,
    priceUpdate,
    editComplete,
    stockUpdate,
    addDiscount,
    removeDiscount,
    editNewDiscountQuantity,
    editNewDiscountRate,
  };
};
