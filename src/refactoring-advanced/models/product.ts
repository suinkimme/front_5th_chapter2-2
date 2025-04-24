import { Product } from "../../types";

export const findProductById = (products: Product[], productId: string) =>
  products.find((item) => item.id === productId);

export const filterdUpdatedProductDiscounts = (
  updatedProduct: Product,
  index: number
) => updatedProduct.discounts.filter((_, i) => i !== index);
