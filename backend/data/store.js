let tasks = [];
let nextId = 1;

function seed() {
  const samples = [
    {
      title: 'Set up the project repository',
      description: 'Create the backend and frontend folders and wire up the dev scripts.',
      priority: 'high',
      completed: true,
    },
    {
      title: 'Build the REST API',
      description: 'Implement the CRUD endpoints plus the toggle route for completion.',
      priority: 'high',
      completed: false,
    },
    {
      title: 'Design the endless carousel',
      description: 'Smooth, infinitely looping task carousel built with vanilla React.',
      priority: 'medium',
      completed: false,
    },
    {
      title: 'Add task filtering',
      description: 'Filter the list by All / Completed / Pending.',
      priority: 'low',
      completed: false,
    },
    {
      title: 'Polish the styling',
      description: 'Responsive layout, priority colours and hover transitions.',
      priority: 'medium',
      completed: false,
    },
  ];

  samples.forEach((sample) => create(sample));
}

function getAll() {
  return tasks.map((task) => ({ ...task }));
}

function getById(id) {
  const task = tasks.find((t) => t.id === id);
  return task ? { ...task } : undefined;
}

function create({ title, description = '', priority = 'medium', completed = false }) {
  const task = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    completed: Boolean(completed),
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  return { ...task };
}

function update(id, updates) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return undefined;

  if (updates.title !== undefined) task.title = updates.title.trim();
  if (updates.description !== undefined) task.description = updates.description.trim();
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.completed !== undefined) task.completed = Boolean(updates.completed);

  return { ...task };
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
function toggle(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return undefined;

  task.completed = !task.completed;
  return { ...task };
}

module.exports = {
  seed,
  getAll,
  getById,
  create,
  update,
  remove,
  toggle,
};
