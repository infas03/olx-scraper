import { memo } from "react";

const PaginationButton = memo(({ onClick, label, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded transition-colors ${
      disabled
        ? 'bg-gray-300 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-600 text-white'
    }`}
    aria-label={label}
  >
    {label}
  </button>
));

export default PaginationButton;