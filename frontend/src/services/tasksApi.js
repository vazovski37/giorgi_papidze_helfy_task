import { request } from './apiClient';

export const tasksApi = {
  list: (options) => request('/tasks', options),

  get: (id, options) => request(`/tasks/${id}`, options),

  create: (task, options) =>
    request('/tasks', { method: 'POST', body: task, ...options }),

  update: (id, updates, options) =>
    request(`/tasks/${id}`, { method: 'PUT', body: updates, ...options }),

  remove: (id, options) =>
    request(`/tasks/${id}`, { method: 'DELETE', ...options }),

  toggle: (id, options) =>
    request(`/tasks/${id}/toggle`, { method: 'PATCH', ...options }),
};
