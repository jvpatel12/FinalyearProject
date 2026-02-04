import React from 'react';

/**
 * Reusable Button Component
 * Supports multiple variants: primary, secondary, outline, danger
 * Supports multiple sizes: sm, md, lg
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  // Base styles
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap';

  // Variant styles
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg disabled:bg-blue-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-95 disabled:bg-gray-100',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 disabled:border-gray-300 disabled:text-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-md hover:shadow-lg disabled:bg-red-400',
  };

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`;

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;