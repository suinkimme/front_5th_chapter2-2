interface IncrementButtonProps {
  onClick: () => void;
}

const IncrementButton = ({ onClick }: IncrementButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
    >
      +
    </button>
  );
};

export default IncrementButton;
