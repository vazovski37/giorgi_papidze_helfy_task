const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function collectErrors(body, { partial }) {
  const errors = [];
  const { title, description, priority, completed } = body;

  if (title === undefined) {
    if (!partial) errors.push('title is required');
  } else if (!isNonEmptyString(title)) {
    errors.push('title must be a non-empty string');
  } else if (title.trim().length > 100) {
    errors.push('title must be 100 characters or fewer');
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('description must be a string');
    } else if (description.length > 500) {
      errors.push('description must be 500 characters or fewer');
    }
  }

  if (priority !== undefined && !ALLOWED_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${ALLOWED_PRIORITIES.join(', ')}`);
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  return errors;
}

function validateCreate(req, res, next) {
  const errors = collectErrors(req.body || {}, { partial: false });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}

function validateUpdate(req, res, next) {
  const body = req.body || {};
  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: ['request body must contain at least one field to update'],
    });
  }

  const errors = collectErrors(body, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
}

module.exports = {
  validateCreate,
  validateUpdate,
  ALLOWED_PRIORITIES,
};
