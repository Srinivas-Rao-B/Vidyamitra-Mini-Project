import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={twMerge(
        'flex h-10 w-full rounded-md border border-vidya-gray-100 bg-transparent py-2 px-3 text-sm placeholder:text-vidya-gray-500 focus:outline-none focus:ring-2 focus:ring-vidya-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export default Input;
