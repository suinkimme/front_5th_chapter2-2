interface SelectBoxProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  placeholder: string;
}

const SelectBox = ({ onChange, options, placeholder }: SelectBoxProps) => {
  return (
    <select onChange={onChange} className="w-full p-2 border rounded mb-2">
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
