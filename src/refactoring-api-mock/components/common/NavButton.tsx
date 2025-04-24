interface NavButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const NavButton = ({ onClick, children }: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
    >
      {children}
    </button>
  );
};

export default NavButton;
