import React from 'react';

import TaskItem from './TaskItem';
import IconButton from './ui/IconButton';
import Icon from './ui/Icon';
import EmptyState from './ui/EmptyState';
import { useCarousel } from '../hooks/useCarousel';
import '../styles/TaskList.css';

function TaskList({ tasks, emptyMessage, onToggle, onEdit, onDelete }) {
  const {
    viewportRef,
    trackRef,
    copies,
    isPaused,
    goPrev,
    goNext,
    togglePlay,
    viewportHandlers,
  } = useCarousel(tasks);

  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const repeated = [];
  for (let copy = 0; copy < copies; copy += 1) {
    tasks.forEach((task) => {
      repeated.push({ task, key: `${task.id}-${copy}`, clone: copy > 0 });
    });
  }

  return (
    <div className="carousel">
      <IconButton
        className="carousel__nav carousel__nav--prev"
        label="Previous task"
        onClick={goPrev}
      >
        <Icon name="chevronLeft" />
      </IconButton>

      <div className="carousel__viewport" ref={viewportRef} {...viewportHandlers}>
        <div className="carousel__track" ref={trackRef}>
          {repeated.map(({ task, key, clone }) => (
            <TaskItem
              key={key}
              task={task}
              clone={clone}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <IconButton
        className="carousel__nav carousel__nav--next"
        label="Next task"
        onClick={goNext}
      >
        <Icon name="chevronRight" />
      </IconButton>

      <button
        type="button"
        className="carousel__play"
        onClick={togglePlay}
        aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
        title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
      >
        <Icon name={isPaused ? 'play' : 'pause'} size={12} />
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}

export default TaskList;