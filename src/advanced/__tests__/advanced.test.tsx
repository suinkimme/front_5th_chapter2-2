import { describe, expect, test, it, vi, beforeEach } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  within,
  renderHook,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/pages/CartPage";
import { AdminPage } from "../../refactoring/pages/AdminPage";
import { Coupon, Product } from "../../types";
import {
  ProductProvider,
  CouponProvider,
  CartProvider,
  AuthProvider,
} from "../../refactoring/contexts";

import {
  useAuth,
  useCart,
  useCoupons,
  useProducts,
} from "../../refactoring/hooks";

import {
  isOutOfStock,
  getRemainingStock,
  getCartItem,
  addOrUpdateCartItem,
  calculateCartItemTotal,
  calculateCartTotal,
  filteredCartItemByProductId,
  updateCartItemQuantity,
} from "../../refactoring/models/cart";

import {
  findProductById,
  filterdUpdatedProductDiscounts,
} from "../../refactoring/models/product";

vi.mock("../models/cart", async () => {
  const actual = await vi.importActual("../models/cart");
  return {
    ...actual,
    addOrUpdateCartItem: vi.fn(),
    updateCartItemQuantity: vi.fn(),
    calculateCartTotal: vi.fn(),
    filteredCartItemByProductId: vi.fn(),
    getRemainingStock: vi.fn(),
    isOutOfStock: vi.fn(),
  };
});

vi.mock("../models/product", async () => {
  const actual = await vi.importActual("../models/product");
  return {
    ...actual,
    findProductById: vi.fn(),
    filterdUpdatedProductDiscounts: vi.fn(),
  };
});

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const mockProduct = {
  id: "p1",
  name: "테스트상품",
  price: 10000,
  stock: 10,
  discounts: [
    { quantity: 5, rate: 0.1 },
    { quantity: 10, rate: 0.2 },
  ],
};

const mockCart = [
  {
    product: mockProduct,
    quantity: 2,
  },
];

const mockCoupon: Coupon = {
  name: "10% 할인 쿠폰",
  code: "PERCENT10",
  discountType: "percentage",
  discountValue: 10,
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(
        <ProductProvider products={mockProducts}>
          <CouponProvider coupons={mockCoupons}>
            <CartProvider>
              <CartPage />
            </CartProvider>
          </CouponProvider>
        </ProductProvider>
      );
      const product1 = screen.getByTestId("product-p1");
      const product2 = screen.getByTestId("product-p2");
      const product3 = screen.getByTestId("product-p3");
      const addToCartButtonsAtProduct1 =
        within(product1).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct2 =
        within(product2).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct3 =
        within(product3).getByText("장바구니에 추가");

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent("상품1");
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(
        <AuthProvider>
          <ProductProvider products={mockProducts}>
            <CouponProvider coupons={mockCoupons}>
              <CartProvider>
                <AdminPage />
              </CartProvider>
            </CouponProvider>
          </ProductProvider>
        </AuthProvider>
      );

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

  describe("자유롭게 작성해보세요.", () => {
    test("새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요", () => {
      describe("Product 관련 함수 테스트", () => {
        it("isOutOfStock - 재고가 0이면 true를 반환해야 함", () => {
          expect(isOutOfStock(0)).toBe(true);
          expect(isOutOfStock(5)).toBe(false);
        });

        it("getRemainingStock - 장바구니 포함한 남은 재고를 계산해야 함", () => {
          const remaining = getRemainingStock(mockCart, mockProduct);
          expect(remaining).toBe(8);
        });

        it("getCartItem - 장바구니에서 해당 상품을 찾을 수 있어야 함", () => {
          const item = getCartItem(mockCart, mockProduct);
          expect(item).toBeDefined();
          expect(item?.product.id).toBe("p1");
        });
      });

      describe("Cart 관련 함수 테스트", () => {
        it("addOrUpdateCartItem - 기존에 없으면 새로 추가되어야 함", () => {
          const newProduct = { ...mockProduct, id: "p2" };
          const newCart = addOrUpdateCartItem(mockCart, newProduct);
          expect(newCart.length).toBe(2);
        });

        it("addOrUpdateCartItem - 기존에 있으면 수량이 증가해야 함", () => {
          const updatedCart = addOrUpdateCartItem(mockCart, mockProduct);
          const updatedItem = updatedCart.find(
            (item) => item.product.id === mockProduct.id
          );
          expect(updatedItem?.quantity).toBe(3);
        });
      });

      describe("Discount / 결제 관련 함수 테스트", () => {
        it("calculateCartItemTotal - 상품별 할인 적용 후 가격 계산", () => {
          const item = { product: mockProduct, quantity: 10 }; // 20% 할인 적용
          const total = calculateCartItemTotal(item);
          expect(total).toBe(10000 * 10 * 0.8);
        });

        it("calculateCartTotal - 쿠폰 적용 후 총액 계산", () => {
          const item = { product: mockProduct, quantity: 10 };
          const cart = [item];
          const { totalAfterDiscount, totalBeforeDiscount, totalDiscount } =
            calculateCartTotal(cart, mockCoupon, null);

          expect(totalBeforeDiscount).toBe(100000); // 10 * 10000
          expect(totalAfterDiscount).toBeCloseTo(72000); // 20% + 10% 쿠폰
          expect(totalDiscount).toBeCloseTo(28000);
        });
      });

      describe("findProductById 함수", () => {
        it("ID로 상품을 정확히 찾아야 함", () => {
          const product = findProductById(mockProducts, "p1");
          expect(product).toBeDefined();
          expect(product?.id).toBe("p1");
          expect(product?.name).toBe("상품1");
        });

        it("없는 ID를 넣으면 undefined를 반환해야 함", () => {
          const product = findProductById(mockProducts, "p999");
          expect(product).toBeUndefined();
        });
      });

      describe("findProductById 함수", () => {
        it("상품 ID로 올바른 상품을 찾아야 함", () => {
          const product = findProductById(mockProducts, "p2");
          expect(product).toBeDefined();
          expect(product?.name).toBe("상품2");
          expect(product?.price).toBe(20000);
        });

        it("존재하지 않는 ID를 넣으면 undefined 반환", () => {
          const product = findProductById(mockProducts, "not-exist");
          expect(product).toBeUndefined();
        });
      });

      describe("filterdUpdatedProductDiscounts 함수", () => {
        const product = mockProducts[2]; // 상품3, discounts: [{ quantity: 10, rate: 0.2 }]

        it("0번째 할인 제거 시, 빈 배열 반환돼야 함", () => {
          const result = filterdUpdatedProductDiscounts(product, 0);
          expect(result).toEqual([]); // 하나밖에 없으니까 제거하면 0개
        });

        it("잘못된 인덱스 넣으면 기존 할인 배열 유지돼야 함", () => {
          const result = filterdUpdatedProductDiscounts(product, 99);
          expect(result).toHaveLength(1);
          expect(result[0].rate).toBe(0.2);
        });
      });
    });

    test("새로운 hook 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요", () => {
      describe("useAuth 훅 테스트", () => {
        it("초기 상태는 isAdmin이 false여야 함", () => {
          const { result } = renderHook(() => useAuth());
          expect(result.current.isAdmin).toBe(false);
        });

        it("toggleAdmin을 호출하면 isAdmin이 true로 바뀌어야 함", () => {
          const { result } = renderHook(() => useAuth());

          act(() => {
            result.current.toggleAdmin();
          });

          expect(result.current.isAdmin).toBe(true);
        });

        it("toggleAdmin을 두 번 호출하면 다시 false가 되어야 함", () => {
          const { result } = renderHook(() => useAuth());

          act(() => {
            result.current.toggleAdmin(); // false → true
            result.current.toggleAdmin(); // true → false
          });

          expect(result.current.isAdmin).toBe(false);
        });
      });

      describe("useCart 훅 (mock 기반)", () => {
        beforeEach(() => {
          vi.clearAllMocks();
        });

        it("addToCart - 장바구니에 상품 추가", () => {
          (addOrUpdateCartItem as ReturnType<typeof vi.fn>).mockReturnValue([
            { product: mockProduct, quantity: 1 },
          ]);

          const { result } = renderHook(() => useCart());

          act(() => {
            result.current.addToCart(mockProduct);
          });

          expect(addOrUpdateCartItem).toHaveBeenCalledWith([], mockProduct);
          expect(result.current.cart).toHaveLength(1);
          expect(result.current.cart[0].product.name).toBe("테스트상품");
        });

        it("handleAddToCart - 재고 없으면 추가 안됨", () => {
          (getRemainingStock as ReturnType<typeof vi.fn>).mockReturnValue(0);
          (isOutOfStock as ReturnType<typeof vi.fn>).mockReturnValue(true);

          const { result } = renderHook(() => useCart());

          act(() => {
            result.current.handleAddToCart([], mockProduct);
          });

          expect(addOrUpdateCartItem).not.toHaveBeenCalled();
          expect(result.current.cart).toEqual([]);
        });

        it("removeFromCart - 상품 제거", () => {
          (
            filteredCartItemByProductId as ReturnType<typeof vi.fn>
          ).mockReturnValue([]);

          const { result } = renderHook(() => useCart());

          act(() => {
            result.current.removeFromCart(mockProduct.id);
          });

          expect(filteredCartItemByProductId).toHaveBeenCalledWith(
            [],
            mockProduct.id
          );
          expect(result.current.cart).toEqual([]);
        });

        it("updateQuantity - 수량 업데이트", () => {
          (updateCartItemQuantity as ReturnType<typeof vi.fn>).mockReturnValue([
            { product: mockProduct, quantity: 5 },
          ]);

          const { result } = renderHook(() => useCart());

          act(() => {
            result.current.updateQuantity(mockProduct.id, 5);
          });

          expect(updateCartItemQuantity).toHaveBeenCalled();
          expect(result.current.cart[0].quantity).toBe(5);
        });

        it("applyCoupon - 쿠폰 적용", () => {
          const { result } = renderHook(() => useCart());

          act(() => {
            result.current.applyCoupon(mockCoupon);
          });

          expect(result.current.selectedCoupon).toEqual(mockCoupon);
        });

        it("calculateTotal - 총액 계산", () => {
          (calculateCartTotal as ReturnType<typeof vi.fn>).mockReturnValue({
            totalBeforeDiscount: 100000,
            totalAfterDiscount: 90000,
            totalDiscount: 10000,
          });

          const { result } = renderHook(() => useCart());

          const total = result.current.calculateTotal();

          expect(calculateCartTotal).toHaveBeenCalled();
          expect(total.totalAfterDiscount).toBe(90000);
        });
      });

      describe("useCoupons 훅 테스트", () => {
        it("초기 쿠폰 리스트가 정상적으로 세팅되어야 함", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          expect(result.current.coupons).toEqual(mockCoupons);
        });

        it("새 쿠폰 추가 시 쿠폰 리스트가 갱신되어야 함", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const newCoupon: Coupon = {
            name: "20% 할인 쿠폰",
            code: "PERCENT20",
            discountType: "percentage",
            discountValue: 20,
          };

          act(() => {
            result.current.addCoupon(newCoupon);
          });

          expect(result.current.coupons).toHaveLength(3);
          expect(result.current.coupons[2]).toEqual(newCoupon);
        });

        it("createCoupon 호출 시 쿠폰 추가 및 newCoupon 초기화 되어야 함", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const tempCoupon: Coupon = {
            name: "1만원 할인 쿠폰",
            code: "AMOUNT10000",
            discountType: "amount",
            discountValue: 10000,
          };

          act(() => {
            result.current.createCoupon(tempCoupon);
          });

          expect(result.current.coupons).toHaveLength(3);
          expect(result.current.coupons[2]).toEqual(tempCoupon);
          expect(result.current.newCoupon).toEqual({
            name: "",
            code: "",
            discountType: "percentage",
            discountValue: 0,
          });
        });

        it("editNewCouponName 동작 확인", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const coupon = result.current.newCoupon;

          act(() => {
            result.current.editNewCouponName(coupon, "새 쿠폰 이름");
          });

          expect(result.current.newCoupon.name).toBe("새 쿠폰 이름");
        });

        it("editNewCouponCode 동작 확인", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const coupon = result.current.newCoupon;

          act(() => {
            result.current.editNewCouponCode(coupon, "NEWCODE123");
          });

          expect(result.current.newCoupon.code).toBe("NEWCODE123");
        });

        it("editNewCouponDiscountType 동작 확인", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const coupon = result.current.newCoupon;

          act(() => {
            result.current.editNewCouponDiscountType(coupon, "amount");
          });

          expect(result.current.newCoupon.discountType).toBe("amount");
        });

        it("editNewCouponDiscountValue 동작 확인", () => {
          const { result } = renderHook(() => useCoupons(mockCoupons));
          const coupon = result.current.newCoupon;

          act(() => {
            result.current.editNewCouponDiscountValue(coupon, 7777);
          });

          expect(result.current.newCoupon.discountValue).toBe(7777);
        });
      });

      describe("useProducts 훅 테스트", () => {
        it("초기 상태가 정상 설정되어야 함", () => {
          const { result } = renderHook(() => useProducts(mockProducts));
          expect(result.current.products).toEqual(mockProducts);
          expect(result.current.newProduct.name).toBe("");
          expect(result.current.newDiscount.rate).toBe(0);
        });

        it("addProduct 실행 시 상품이 추가되어야 함", () => {
          const { result } = renderHook(() => useProducts([]));

          const newProduct = {
            id: "p2",
            name: "새 상품",
            price: 9999,
            stock: 5,
            discounts: [],
          };

          act(() => {
            result.current.addProduct(newProduct);
          });

          expect(result.current.products).toHaveLength(1);
          expect(result.current.products[0].name).toBe("새 상품");
        });

        it("createProduct 호출 시 상품이 추가되고 폼이 초기화 되어야 함", () => {
          const { result } = renderHook(() => useProducts([]));

          const formProduct = {
            name: "폼 상품",
            price: 5000,
            stock: 3,
            discounts: [],
          };

          act(() => {
            result.current.createProduct(formProduct);
          });

          expect(result.current.products).toHaveLength(1);
          expect(result.current.products[0].name).toBe("폼 상품");
          expect(result.current.newProduct.name).toBe("");
          expect(result.current.showNewProductForm).toBe(false);
        });

        it("editProduct, productNameUpdate - 상품 편집 후 이름 수정 가능해야 함", () => {
          const { result } = renderHook(() => useProducts(mockProducts));

          act(() => {
            result.current.editProduct(mockProducts[0]);
          });

          act(() => {
            result.current.productNameUpdate("p1", "수정된 이름");
          });

          expect(result.current.editingProduct?.name).toBe("수정된 이름");
        });

        it("editComplete - 편집 종료 시 상품 정보 반영 및 편집 상태 초기화", () => {
          const { result } = renderHook(() => useProducts(mockProducts));

          act(() => {
            result.current.editProduct(mockProducts[0]);
          });

          act(() => {
            result.current.productNameUpdate("p1", "완료된 이름");
          });

          act(() => {
            result.current.editComplete();
          });

          expect(result.current.editingProduct).toBe(null);
          expect(result.current.products[0].name).toBe("완료된 이름");
        });

        it("addDiscount - 할인 추가 후 상태 초기화", () => {
          (findProductById as ReturnType<typeof vi.fn>).mockReturnValue(
            mockProducts[0]
          );

          const { result } = renderHook(() => useProducts(mockProducts));

          act(() => {
            result.current.editProduct(mockProducts[0]);
          });

          act(() => {
            result.current.editNewDiscountRate({ quantity: 0, rate: 0 }, 0.2);
            result.current.editNewDiscountQuantity(
              { quantity: 0, rate: 0.2 },
              5
            );
          });

          act(() => {
            result.current.addDiscount(mockProducts, "p1");
          });

          expect(result.current.editingProduct?.discounts.length).toBe(2);
          expect(result.current.newDiscount.quantity).toBe(0);
        });

        it("removeDiscount - 인덱스에 해당하는 할인 제거", () => {
          (findProductById as ReturnType<typeof vi.fn>).mockReturnValue(
            mockProducts[0]
          );
          (
            filterdUpdatedProductDiscounts as ReturnType<typeof vi.fn>
          ).mockReturnValue([]);

          const { result } = renderHook(() => useProducts(mockProducts));

          act(() => {
            result.current.removeDiscount(mockProducts, "p1", 0);
          });

          expect(result.current.editingProduct?.discounts.length).toBe(0);
        });

        it("toggleProductAccordion - 아코디언 열기/닫기", () => {
          const { result } = renderHook(() => useProducts(mockProducts));

          act(() => {
            result.current.toggleProductAccordion("p1");
          });

          expect(result.current.openProductIds.has("p1")).toBe(true);

          act(() => {
            result.current.toggleProductAccordion("p1");
          });

          expect(result.current.openProductIds.has("p1")).toBe(false);
        });

        it("editNewProductName / Price / Stock 테스트", () => {
          const { result } = renderHook(() => useProducts([]));

          act(() => {
            result.current.editNewProductName(
              result.current.newProduct,
              "새상품"
            );
            result.current.editNewProductPrice(result.current.newProduct, 1234);
            result.current.editNewProductStock(result.current.newProduct, 10);
          });

          expect(result.current.newProduct.name).toBe("새상품");
          expect(result.current.newProduct.price).toBe(1234);
          expect(result.current.newProduct.stock).toBe(10);
        });
      });
    });
  });
});
