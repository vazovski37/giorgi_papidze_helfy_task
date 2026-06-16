const express = require('express');
const store = require('../data/store');
const { validateCreate, validateUpdate } = require('../middleware/validateTask');
const router = express.Router();

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }
  req.taskId = id;
  next();
}

router.get('/', (req, res) => {
  res.status(200).json(store.getAll());
});

router.get('/:id', validateId, (req, res) => {
  const task = store.getById(req.taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }
  res.status(200).json(task);
});

router.post('/', validateCreate, (req, res) => {
  const created = store.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', validateId, validateUpdate, (req, res) => {
  const updated = store.update(req.taskId, req.body);
  if (!updated) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }
  res.status(200).json(updated);
});

router.delete('/:id', validateId, (req, res) => {
  const deleted = store.remove(req.taskId);
  if (!deleted) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }
  res.status(204).end();
});

router.patch('/:id/toggle', validateId, (req, res) => {
  const toggled = store.toggle(req.taskId);
  if (!toggled) {
    return res.status(404).json({ error: `Task ${req.taskId} not found` });
  }
  res.status(200).json(toggled);
});

module.exports = router;
