const express = require('express');
const cors = require('cors');

const store = require('./data/store');
const tasksRouter = require('./routes/tasks');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler);

store.seed();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Manager API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
