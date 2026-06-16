import React from 'react';

function Banner({ children, action, role = 'alert' }) {
  return (
    <div className="banner banner--error" role={role}>
      <span>{children}</span>
      {action}
    </div>
  );
}

export default Banner;
