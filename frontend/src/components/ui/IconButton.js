import React from 'react';

function IconButton({ label, className = '', type = 'button', children, ...rest }) {
  return (
    <button
      type={type}
      className={className}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </button>
  );
}

export default IconButton;
