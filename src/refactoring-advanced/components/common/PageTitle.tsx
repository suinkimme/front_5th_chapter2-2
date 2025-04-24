interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = ({ children }: PageTitleProps) => {
  return <h2 className="text-3xl font-bold mb-6">{children}</h2>;
};

export default PageTitle;
