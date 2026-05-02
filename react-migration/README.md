# Playlah Client — React Migration

React 19 + Vite rewrite of the original vanilla-JS Playlah frontend.

## Requirements

| Tool | Version |
|------|---------|
| Node.js | **18 or 20** (Node 16 is not supported by Vite 6 or React Router 7) |
| npm | 8+ |

> **If you are on Node 16**, upgrade first:
> ```bash
> # Using nvm
> nvm install 20 && nvm use 20
>
> # Or download from https://nodejs.org
> ```

## Project structure

```
react-migration/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Authentication screen
│   │   ├── Users.jsx          # User list + create user
│   │   ├── Groups.jsx         # My groups + other groups
│   │   ├── Events.jsx         # Group events + create event
│   │   └── EventDetails.jsx   # Event detail + join + chat
│   ├── components/
│   │   └── Chat.jsx           # Real-time chat (polling)
│   ├── context/
│   │   └── AuthContext.jsx    # Auth token shared via React context
│   ├── services/
│   │   └── api.js             # All fetch calls to the backend
│   ├── App.jsx                # Routes + protected route guard
│   ├── main.jsx               # Entry point
│   └── style.css              # Original styles preserved
├── index.html
├── vite.config.js
└── package.json
```

## Install

```bash
cd react-migration
npm install
```

## Run (development)

```bash
npm run dev
```

Opens at **http://localhost:5173** by default.

The app expects the Playlah backend API running at `http://localhost:8080`. To change this, edit `src/services/api.js`:

```js
const BASE_URL = 'http://localhost:8080'
```

## Build (production)

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Navigation flow

```
/               Login
/users          User list — click a row to continue
/users/:id/groups                      Groups for that user
/users/:id/groups/:id/events           Events for that group
/users/:id/groups/:id/events/:id/details   Event detail + chat
```

All routes except `/` are protected — unauthenticated visits redirect to `/`.

## What changed from the original

| Original | React version |
|----------|--------------|
| Hand-rolled state machine | React Router v7 routes |
| `stateMachine.cache['auth']` | `AuthContext` (React context) |
| Imperative DOM manipulation | Declarative JSX + `useState` |
| `setInterval` leak in chat | `useEffect` cleanup (`clearInterval`) |
| `app` reference bug in event_details | Fixed — uses component state |
| `isCodeResource` `this` bug in server.js | N/A — Vite serves static assets |
| Dead `src/state_machine.js` | Removed |
| Hardcoded memberId UUID | Removed |



export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && \. "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && \. "$(brew --prefix nvm)/etc/bash_completion.d/nvm"
