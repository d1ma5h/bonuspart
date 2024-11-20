// components/ui/Button.tsx
import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  asLink?: boolean;
  href?: string;
}

const variantStyles: { [key in NonNullable<ButtonProps['variant']>]: string } = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  asLink = false,
  href,
  children,
  className = '',
  ...props
}) => {
  const classes = `px-4 py-2 rounded-md font-medium ${variantStyles[variant]} transition-colors duration-200 ${className}`;

  if (asLink && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
