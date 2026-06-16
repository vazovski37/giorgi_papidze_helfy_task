import React from 'react';

function Button({
  variant = 'ghost',
  size,
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {children}
    </button>
  );
}

export default Button;
