import { useState } from "react";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  };

  return {
    isAdmin,
    toggleAdmin,
  };
};
