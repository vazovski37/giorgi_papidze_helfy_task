import React from 'react';

import { FILTERS } from '../constants';
import '../styles/TaskFilter.css';

function TaskFilter({ current, counts, onChange }) {
  return (
    <div className="task-filter" role="group" aria-label="Filter tasks by status">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`task-filter__btn ${current === key ? 'is-active' : ''}`}
          onClick={() => onChange(key)}
          aria-pressed={current === key}
        >
          {label}
          <span className="task-filter__count">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
