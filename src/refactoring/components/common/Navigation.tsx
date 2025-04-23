import { useAuthContext } from "../../contexts";

import { NavTitle, NavButton } from "./";

const Navigation = () => {
  const { isAdmin, toggleAdmin } = useAuthContext();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavTitle>쇼핑몰 관리 시스템</NavTitle>
        <NavButton onClick={toggleAdmin}>
          {isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
        </NavButton>
      </div>
    </nav>
  );
};

export default Navigation;
