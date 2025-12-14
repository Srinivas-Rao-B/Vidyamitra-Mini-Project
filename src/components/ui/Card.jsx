import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children }) => {
  return (
    <div className={twMerge('bg-white rounded-xl shadow-md overflow-hidden', className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => {
  return <div className={twMerge('p-4 sm:p-6 border-b border-vidya-gray-100', className)}>{children}</div>;
};

const CardContent = ({ className, children }) => {
  return <div className={twMerge('p-4 sm:p-6', className)}>{children}</div>;
};

const CardTitle = ({ className, children }) => {
  return <h3 className={twMerge('text-lg font-bold text-vidya-gray-900', className)}>{children}</h3>
}


Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;

export default Card;
