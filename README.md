# MojoChat

Minimal real-time chat app. Client: React + Vite + Tailwind + Redux with Google OAuth. Server: Mojo.js HTTP/WebSocket, Prisma/PostgreSQL, Zod validation.

## Dependencies
- Node.js >= 22
- PostgreSQL >= 14
- Package manager: pnpm

## Useful commands for first setup:
For Linux (apt) you can install PostgreSQL with:
`sudo apt install -y postgresql postgresql-contrib`

Create a user with:
`sudo -u postgres psql -c "CREATE USER <username> WITH SUPERUSER PASSWORD '<password>';"`

Create a database with:
`createdb <dbname>`

## Folder structure
```text
mojo-chat/
├─ client/
│  ├─ public/
│  ├─ src/
│  │  ├─ app/            # Redux store
│  │  ├─ components/     # UI components
│  │  ├─ features/       # Redux slices
│  │  ├─ pages/          # Routes (Login/Register, Chat)
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ tailwind.config.js
│  └─ package.json
├─ server/
│  ├─ controllers/       # chat, user, download
│  ├─ helpers/           # schemas, validators, utils
│  ├─ prisma/            # schema + migrations
│  ├─ test/              # API & WS tests
│  ├─ index.js
│  └─ package.json
├─ LICENSE
├─ Makefile
└─ README.md
```

## Useful Makefile commands
- `make all`: Runs build, format, lint, and test.
- `make build`: Installs deps (pnpm) for client/server and builds the client.
- `make build-clean`: Same as build, but with `--frozen-lockfile` (exact lockfile versions).
- `make build-prod`: Production build; prunes client dev deps and installs server prod deps.
- `make format`: Formats client/server and Prisma schema.
- `make lint`: Type-checks the server (`pnpm tsc`).
- `make test`: Generates Prisma client, prepares test DB, runs tests.
- `make test-prod`: Installs with frozen lockfile, runs tests, then prunes to prod deps.

## Development
1. Make sure you've set up the environment variables in the `.env` file correctly.
2. Run `make` to build the project and run tests.
3. Cd into server and run 'pnpm dev' to start the server in development mode.
4. cd into client and run 'pnpm dev' to start the client in development mode.
5. Client app should be available at http://localhost:3000.
