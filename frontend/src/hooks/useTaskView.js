import { useMemo, useState } from 'react';

import { PRIORITY_ORDER } from '../constants';
import { useDebouncedValue } from './useDebouncedValue';

function byNewest(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id;
}

const COMPARATORS = {
  newest: byNewest,
  oldest: (a, b) => -byNewest(a, b),
  priority: (a, b) =>
    PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority] || byNewest(a, b),
  title: (a, b) => a.title.localeCompare(b.title) || byNewest(a, b),
};

export function useTaskView(tasks) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const debouncedSearch = useDebouncedValue(search, 200);

  const searchScoped = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
    );
  }, [tasks, debouncedSearch]);

  const counts = useMemo(
    () => ({
      all: searchScoped.length,
      completed: searchScoped.filter((t) => t.completed).length,
      pending: searchScoped.filter((t) => !t.completed).length,
    }),
    [searchScoped]
  );

  const visibleTasks = useMemo(() => {
    const byStatus = searchScoped.filter((t) => {
      if (filter === 'completed') return t.completed;
      if (filter === 'pending') return !t.completed;
      return true;
    });
    return [...byStatus].sort(COMPARATORS[sort] || byNewest);
  }, [searchScoped, filter, sort]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    sort,
    setSort,
    counts,
    visibleTasks,
  };
}
