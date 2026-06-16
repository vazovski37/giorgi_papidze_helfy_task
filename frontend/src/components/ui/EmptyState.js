import React from 'react';

import Icon from './Icon';

function EmptyState({ message, icon = 'inbox' }) {
  return (
    <div className="state state--empty">
      <div className="state__icon">
        <Icon name={icon} size={46} strokeWidth={1.5} />
      </div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
