import { useCallback, useEffect, useState } from 'react';

import { tasksApi } from '../services/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.list({ signal });
      setTasks(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  const createTask = useCallback(async (data) => {
    const created = await tasksApi.create(data);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    const updated = await tasksApi.update(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const toggleTask = useCallback(async (id) => {
    try {
      const updated = await tasksApi.toggle(id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await tasksApi.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    reload,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
