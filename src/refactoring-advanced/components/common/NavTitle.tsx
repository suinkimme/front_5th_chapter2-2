interface NavTitleProps {
  children: React.ReactNode;
}

const NavTitle = ({ children }: NavTitleProps) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};

export default NavTitle;
