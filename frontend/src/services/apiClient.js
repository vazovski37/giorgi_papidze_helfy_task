import { API_BASE_URL, REQUEST_TIMEOUT } from '../constants';

export class ApiError extends Error {
  constructor(message, { status = 0, details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function request(
  path,
  { method = 'GET', body, signal, timeout = REQUEST_TIMEOUT } = {}
) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (timedOut) {
      throw new ApiError('The request timed out. Please try again.', { status: 0 });
    }
    if (err.name === 'AbortError') throw err;
    throw new ApiError(
      'Cannot reach the server. Is the backend running on port 4000?',
      { status: 0 }
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.error || (data.details && data.details.join(', ')))) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, {
      status: response.status,
      details: (data && data.details) || [],
    });
  }

  return data;
}
