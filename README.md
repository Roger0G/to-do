# Todo App

This project provides a todo application with a **React 18** frontend and a **Node.js** backend implemented as Netlify Functions. The frontend is written in TypeScript and built with Vite. The backend exposes a REST API with full CRUD functionality persisted in a SQLite database.

> **Note**: The SQLite file `todos.db` is created inside the function's runtime directory. The directory is ephemeral, so the database is lost whenever the function is redeployed or restarted. For real deployments, connect the API to an external database or other persistent storage.

Each todo stores a title, completion flag, urgency level (1&ndash;3) and a creation timestamp. Items can be sorted by creation date or urgency in the UI.

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend functions

Install the Netlify CLI if you haven't already and start the development server which serves both the frontend and the functions. Make sure dependencies are installed in `netlify/` so the SQLite driver is available:

```bash
npm install -g netlify-cli # optional if already installed
cd netlify && npm install
netlify dev
```

Requests to `/api/*` will be proxied to the function defined in `netlify/functions`.

## Deploying to Netlify

1. Commit the included `netlify.toml` configuration.
2. Create a new site in the Netlify dashboard from this repository.
3. Netlify will run `npm run build` in `frontend/` and publish the contents of `frontend/dist`.
4. API calls from the frontend to `/api/*` will run the Netlify Functions backend.

## Testing

You can run basic type checks locally:

```bash
cd frontend && npm run lint
```

Run `netlify dev` and use any HTTP client or the React UI to exercise the CRUD endpoints exposed by the functions.
