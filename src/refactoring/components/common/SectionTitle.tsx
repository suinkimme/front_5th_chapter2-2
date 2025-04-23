interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => {
  return <h2 className="text-2xl font-semibold mb-4">{children}</h2>;
};

export default SectionTitle;
