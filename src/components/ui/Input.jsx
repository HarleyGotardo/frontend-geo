import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
  const errorClasses = error ? 'border-red-300' : 'border-gray-300';
  const inputClasses = `${baseClasses} ${errorClasses} ${icon ? 'pl-10' : ''} ${className}`;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={props.id} className="sr-only">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
