# Task Manager App

This is a small full-stack task manager. **In this project I tried not to over-engineer the codebase, but at the same time keep the code clean and structured.** That's why I split the logic into custom hooks, made small reusable UI components, and kept the API calls in their own service layer instead of repeating `fetch` everywhere. The idea is simple: every part has one job, so the code stays easy to read and easy to change later.

The most important part for me was the endless task carousel, so I built it from scratch with plain React and `requestAnimationFrame` — no carousel library — and made it loop infinitely and scroll smoothly. The rest of the app does the usual things: create, edit, delete and toggle tasks, plus filtering, search, sorting, and a light/dark theme.

---

## Project Structure


```
task-manager/
├── backend/
│   ├── package.json
│   ├── server.js               # Express app + middleware wiring
│   ├── routes/
│   │   └── tasks.js            # /api/tasks endpoints (+ validateId middleware)
│   ├── middleware/
│   │   ├── validateTask.js     # request body validation
│   │   └── errorHandler.js     # 404 + central error handler
│   └── data/
│       └── store.js            # in-memory task store + seed data
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js              # composition root (wires hooks to components)
│       ├── components/
│       │   ├── TaskList.js     # the endless carousel
│       │   ├── TaskItem.js
│       │   ├── TaskForm.js
│       │   ├── TaskFilter.js
│       │   └── ui/             # reusable primitives: Button, IconButton, Icon,
│       │       ...             #   Badge, Banner, Spinner, EmptyState, Field, Modal
│       ├── hooks/              # useTasks, useTaskView, useTheme, useCarousel,
│       │   ...                 #   useDebouncedValue, usePrefersReducedMotion
│       ├── services/
│       │   ├── apiClient.js    # fetch + timeout + abort + typed ApiError
│       │   └── tasksApi.js     # task domain methods over the client
│       ├── constants/          # API config, priorities, filter/sort options
│       ├── lib/                # small pure helpers (formatDate)
│       └── styles/             # plain CSS, one file per area
├── .editorconfig
├── .nvmrc
├── .prettierrc
├── .gitignore
└── README.md
```

---

## Setup & Installation

The project requires **Node.js 18+** and npm (the repository pins Node 20 via `.nvmrc`). The backend and frontend apps are independent, so you will need to run them in two separate terminal windows.

> **Note:** Start the backend first so the frontend has data to load. If the backend is down, the UI will show an error banner with a **Retry** button.

### 1. Backend Setup
```bash
cd backend
npm install
npm start          # runs on http://localhost:4000

```

You should see a message saying `Task Manager API listening on http://localhost:4000`. The in-memory store is seeded with a handful of sample tasks on every boot.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000

```

The app will automatically open at `http://localhost:3000` and communicate with the backend on port 4000. If you decide to host the API elsewhere, you can configure the endpoint by setting `REACT_APP_API_URL` (see `frontend/.env.example`).

---

## What the App Can Do

* **Endless Animated Carousel:** The task list automatically scrolls in a smooth, never-ending loop.
* **Full CRUD Actions:** You can create, edit (in a pop-up), delete (with an "Are you sure?" check), and toggle tasks done/undone.
* **Filter & Search:** Filter by *All / Pending / Completed* with live counts, search with a split-second typing delay to stay fast, and sort by date, priority, or title.
* **Light & Dark Mode:** Saves your choice to `localStorage` so it remembers your preference.
* **Reliable Backend Sync:** Shows a clear error and a "Retry" button if the server goes down, rather than a blank screen.

---

## Frontend Architecture

I tried to keep the components mostly about rendering and move the actual logic into custom hooks. Instead of one big `App` component doing everything, each hook handles one specific task:

* **useTasks:** Holds the task list and manages all the CRUD server calls. It also safely cancels its initial request if the component unmounts.
* **useTaskView:** Takes the raw tasks and processes them through our search (debounced), status filters, and sorting choices. It also calculates the live counts for each filter.
* **useCarousel:** Handles all the carousel logic. It measures the loop length, runs the `requestAnimationFrame` auto-scroll, and exposes the playback controls.
* **useTheme, useDebouncedValue, usePrefersReducedMotion:** Small helpers for switching theme modes, delaying search execution, and respecting system motion rules.

For the network code, I centralized our communication logic into two layers instead of spreading `fetch` calls around:

* **apiClient:** Our low-level wrapper that adds the base URL, parses JSON, handles timeouts via `AbortSignal`, and throws custom `ApiError` instances containing HTTP statuses and backend validation messages.
* **tasksApi:** Sits cleanly on top of the client to define our explicit task domain endpoints.

I also created a `components/ui/` folder with reusable pieces used across the app, including standard buttons, icons, spinners, and an accessible `Modal` that automatically traps focus, closes on `Escape`, and restores focus on destruction.

---

## How the Endless Carousel Works

This was the main part of the assignment. I built the animation logic inside `useCarousel.js` to keep it completely isolated from the view layout.

* **The Trick:** I render the task list a few times in a row inside one long flex row. A `requestAnimationFrame` loop slides the row to the left on every frame using `translate3d` transforms so the browser handles it directly on the GPU without triggering document reflows.
* **The Loop:** As soon as the row moves by exactly the width of one full copy of the list, it instantly snaps back to `0`. Because the copies look perfectly identical, you cannot see the jump, creating an infinite loop.
* **Performance:** Everything that updates on every frame (like position and speed offsets) is stored in React `refs`, not component state. This keeps the animation running smoothly at 60fps+ without causing React to constantly re-render. Cards are also memoized so they only redraw when their underlying data changes.
* **Extra Touches:** The timeline automatically pauses on hover or keyboard focus, includes manual Play/Pause buttons, offers smooth Next/Prev arrows, and completely disables auto-scroll if a user has "Reduce Motion" enabled in their operating system.

---

## API Documentation

Base URL: `http://localhost:4000/api`

### Task Model

```json
{
  "id": 1,                                  // number (auto-incremented)
  "title": "Build the REST API",            // string, required, 1–100 chars
  "description": "…",                       // string, optional, ≤ 500 chars
  "completed": false,                       // boolean
  "createdAt": "2026-06-16T10:15:48.308Z",  // ISO date string
  "priority": "high"                        // 'low' | 'medium' | 'high'
}

```

### Endpoints

| Method | Path | Description | Success Code |
| --- | --- | --- | --- |
| GET | `/api/tasks` | List all tasks | 200 |
| GET | `/api/tasks/:id` | Get one task | 200 |
| POST | `/api/tasks` | Create a task | 201 |
| PUT | `/api/tasks/:id` | Update a task | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 204 |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion | 200 |
| GET | `/api/health` | Health check | 200 |

* **Request Bodies:** `POST` expects a `title` at minimum (`description`, `priority`, and `completed` default to `''`, `'medium'`, and `false`). `PUT` accepts any subset of editable fields and applies partial updates.
* **Status Codes:** Returns `400` on validation failure (bad fields, non-numeric IDs, or poorly formed JSON) with an error payload explaining the exact issues. Returns `404` for missing endpoints or task IDs, and `500` for server exceptions.

### Terminal Interaction Examples

```bash
# Create a task
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship it","description":"Final review","priority":"high"}'

# Update a task's state
curl -X PUT http://localhost:4000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Toggle a task
curl -X PATCH http://localhost:4000/api/tasks/1/toggle

# Delete a task
curl -X DELETE http://localhost:4000/api/tasks/1

```

---

## My Choices & Design Decisions

* **In-Memory Storage:** Data resets when the server restarts. I isolated all data operations into one backend file (`data/store.js`) using database-style function interfaces, making it easy to swap in a real database later.
* **Clean Architecture:** State lives entirely inside custom hooks, keeping individual components simple and readable.
* **Plain CSS:** I wrote 100% plain CSS for a clean, modern look. Theme switching is handled effortlessly using a minimal set of global CSS variables.
* **Accessibility:** It features visible focus rings, keyboard-friendly modals, and hides the duplicated carousel cards from screen readers so tasks aren't announced multiple times.
* **Mobile Tweaks:** I set input fonts to 16px to prevent iOS Safari from zooming in automatically, and removed heavy shadows to keep mobile screens clean.

**Bonus Features Added:** Debounced search, advanced sorting, saved dark mode, inline delete confirmations, network timeout protections, and reduced-motion support.

---

## What I Deliberately Left Out

To keep the design clean and focused, I purposefully showed restraint and avoided over-engineering the project:

* **No Global State Library (Redux/Zustand):** Standard React state, custom hooks, and basic props are more than enough for an app of this size.
* **No Carousel Virtualization:** Since I only need to make a couple of copies of the list to fill the screen, adding complex windowing code would solve a performance problem this app doesn't actually have.
* **No CSS Framework or Design Tokens:** I stuck to the plain CSS requirement and kept it simple with just a handful of theme variables.
* **No TypeScript, Auth, or Real Database:** These were outside the scope of the assignment, so I left them out to focus on delivering a solid core project.


## Time Spent

I built the backend first and the frontend after — you can actually see it in the
git history, I pushed the backend at around 3:15 PM and the frontend at around
5:20 PM the same day.

Roughly, the time went like this:

| Part                                              | Time     |
| ------------------------------------------------- | -------- |
| Backend (API, in-memory store, validation, etc.)  | ~1h 15m  |
| Frontend core + the endless carousel              | ~2h 10m  |
| writing readme                                    | ~30m     |
