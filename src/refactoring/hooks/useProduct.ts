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
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const createProduct = (newProduct: Omit<Product, "id">) => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((item) => (item.id === product.id ? product : item))
    );
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

  const stockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      updateProduct(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const editComplete = () => {
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
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

  const toggleShowNewProductForm = (show: boolean) => {
    setShowNewProductForm(show);
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

  const editNewProductStock = (
    newProduct: Omit<Product, "id">,
    newStock: number
  ) => {
    setNewProduct({
      ...newProduct,
      stock: newStock,
    });
  };

  const editNewProductPrice = (
    newProduct: Omit<Product, "id">,
    newPrice: number
  ) => {
    setNewProduct({
      ...newProduct,
      price: newPrice,
    });
  };

  const editNewProductName = (
    newProduct: Omit<Product, "id">,
    newName: string
  ) => {
    setNewProduct({
      ...newProduct,
      name: newName,
    });
  };

  return {
    products,
    newProduct,
    newDiscount,
    openProductIds,
    showNewProductForm,
    editingProduct,
    createProduct,
    addProduct,
    updateProduct,
    toggleProductAccordion,
    editProduct,
    productNameUpdate,
    priceUpdate,
    stockUpdate,
    editComplete,
    addDiscount,
    removeDiscount,
    editNewDiscountQuantity,
    editNewDiscountRate,
    toggleShowNewProductForm,
    editNewProductStock,
    editNewProductPrice,
    editNewProductName,
  };
};
