import React, { useCallback, useState } from 'react';

import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import Button from './components/ui/Button';
import IconButton from './components/ui/IconButton';
import Icon from './components/ui/Icon';
import Banner from './components/ui/Banner';
import Spinner from './components/ui/Spinner';
import { useTasks } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { useTaskView } from './hooks/useTaskView';
import { SORT_OPTIONS } from './constants';
import './styles/App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    tasks,
    loading,
    error,
    reload,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks();
  const { filter, setFilter, search, setSearch, sort, setSort, counts, visibleTasks } =
    useTaskView(tasks);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openCreate = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleSubmit = useCallback(
    async (data) => {
      if (editingTask) await updateTask(editingTask.id, data);
      else await createTask(data);
      closeForm();
    },
    [editingTask, updateTask, createTask, closeForm]
  );

  const emptyMessage =
    tasks.length === 0
      ? 'No tasks yet — create your first task to get the carousel spinning.'
      : 'No tasks match your current search or filter.';

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__title">
          <h1>Task Manager</h1>
          <p>Keep everything moving in an endless carousel.</p>
        </div>

        <IconButton
          className="theme-toggle"
          label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={toggleTheme}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </IconButton>
      </header>

      <section className="controls">
        <div className="controls__row">
          <input
            type="search"
            className="search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />

          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort tasks"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button variant="primary" className="add-btn" onClick={openCreate}>
            + New Task
          </Button>
        </div>

        <TaskFilter current={filter} counts={counts} onChange={setFilter} />
      </section>

      {error && (
        <Banner
          action={
            <button type="button" className="banner__action" onClick={() => reload()}>
              Retry
            </button>
          }
        >
          {error}
        </Banner>
      )}

      <main className="app-main">
        {loading ? (
          <div className="state state--loading">
            <Spinner />
            <p>Loading tasks…</p>
          </div>
        ) : (
          <TaskList
            tasks={visibleTasks}
            emptyMessage={emptyMessage}
            onToggle={toggleTask}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
        )}
      </main>

      {formOpen && (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
      )}
    </div>
  );
}

export default App;
