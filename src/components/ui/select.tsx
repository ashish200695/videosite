interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, id, options, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-200">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
