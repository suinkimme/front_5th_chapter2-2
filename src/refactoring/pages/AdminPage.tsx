import { PageTitle, ProductMenagement, CouponMenagement } from "../components";

export const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <PageTitle>관리자 페이지</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductMenagement />
        <CouponMenagement />
      </div>
    </div>
  );
};
