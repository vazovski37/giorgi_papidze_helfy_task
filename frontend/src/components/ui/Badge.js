import React from 'react';

function Badge({ priority }) {
  return <span className={`badge badge--${priority}`}>{priority}</span>;
}

export default Badge;
