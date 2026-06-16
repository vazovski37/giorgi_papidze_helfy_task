import React, { useState } from 'react';

import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatDate } from '../lib/formatDate';
import '../styles/TaskItem.css';

function TaskItem({ task, onToggle, onEdit, onDelete, clone = false }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const tabIndex = clone ? -1 : undefined;

  return (
    <article
      className={`task-item priority-${task.priority} ${
        task.completed ? 'task-item--done' : ''
      }`}
      aria-hidden={clone || undefined}
    >
      <div className="task-item__top">
        <Badge priority={task.priority} />
        <span className="task-item__date">{formatDate(task.createdAt)}</span>
      </div>

      <h3 className="task-item__title">{task.title}</h3>

      {task.description && <p className="task-item__desc">{task.description}</p>}

      <div className="task-item__status">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            tabIndex={tabIndex}
          />
          <span>{task.completed ? 'Completed' : 'Pending'}</span>
        </label>
      </div>

      {confirmingDelete ? (
        <div className="task-item__confirm">
          <span>Delete this task?</span>
          <div className="task-item__confirm-actions">
            <Button
              variant="danger"
              size="sm"
              tabIndex={tabIndex}
              onClick={() => {
                onDelete(task.id);
                setConfirmingDelete(false);
              }}
            >
              Yes, delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              tabIndex={tabIndex}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="task-item__actions">
          <Button
            variant="ghost"
            size="sm"
            tabIndex={tabIndex}
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="danger-ghost"
            size="sm"
            tabIndex={tabIndex}
            onClick={() => setConfirmingDelete(true)}
          >
            Delete
          </Button>
        </div>
      )}
    </article>
  );
}

export default React.memo(TaskItem);
