import React from 'react';

function Field({ label, htmlFor, error, footer, children }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {footer || (error ? <span className="field__error">{error}</span> : null)}
    </div>
  );
}

export default Field;
