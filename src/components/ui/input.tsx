interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-200">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition ${
          error ? 'border-red-500' : 'border-gray-700'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
