import React, { useState } from 'react';

import Modal from './ui/Modal';
import Field from './ui/Field';
import Button from './ui/Button';
import Banner from './ui/Banner';
import { PRIORITIES, TITLE_MAX, DESC_MAX } from '../constants';
import '../styles/TaskForm.css';

function TaskForm({ task, onSubmit, onCancel }) {
  const isEdit = Boolean(task);

  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [priority, setPriority] = useState(task ? task.priority : 'medium');

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      next.title = 'Title is required.';
    } else if (trimmedTitle.length > TITLE_MAX) {
      next.title = `Title must be ${TITLE_MAX} characters or fewer.`;
    }
    if (description.trim().length > DESC_MAX) {
      next.description = `Description must be ${DESC_MAX} characters or fewer.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Task' : 'New Task'} onClose={onCancel}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            aria-invalid={Boolean(errors.title)}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          footer={
            <div className="field__meta">
              <span>
                {errors.description && (
                  <span className="field__error">{errors.description}</span>
                )}
              </span>
              <span className="field__count">
                {description.length}/{DESC_MAX}
              </span>
            </div>
          }
        >
          <textarea
            id="description"
            value={description}
            rows={3}
            maxLength={DESC_MAX}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a few more details (optional)"
            aria-invalid={Boolean(errors.description)}
          />
        </Field>

        <Field label="Priority" htmlFor="priority">
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        {submitError && <Banner>{submitError}</Banner>}

        <div className="modal__actions">
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskForm;
