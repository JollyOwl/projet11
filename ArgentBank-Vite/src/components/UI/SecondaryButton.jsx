import React from 'react';

function SecondaryButton({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`rounded-md border border-green-600 px-4 py-2  font-bold text-green-600 shadow-sm mx-auto hover:bg-green-200 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecondaryButton; 