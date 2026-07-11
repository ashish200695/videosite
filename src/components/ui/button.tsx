interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses: Record<string, string> = {
    primary: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-600 text-gray-100 hover:border-gray-400 hover:text-white',
    ghost: 'text-gray-100 hover:bg-gray-800',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
