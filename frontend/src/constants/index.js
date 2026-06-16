export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const REQUEST_TIMEOUT = 8000;

export const PRIORITIES = ['low', 'medium', 'high'];

export const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

export const TITLE_MAX = 100;
export const DESC_MAX = 500;

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority (high → low)' },
  { value: 'title', label: 'Title (A → Z)' },
];
