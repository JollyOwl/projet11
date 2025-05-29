import React from 'react';

function PrimaryButton({ children, type = 'button', disabled = false, className = '', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`mx-auto rounded-md border bg-green-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-green-700 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton; 