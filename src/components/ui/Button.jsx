import React from 'react';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-vidya-pink focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-vidya-dark-pink text-white hover:bg-vidya-pink',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'bg-transparent border border-vidya-dark-pink text-vidya-dark-pink hover:bg-vidya-light-pink',
        ghost: 'bg-transparent hover:bg-vidya-light-pink',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

export default Button;
