all:
	make format && make rebuild && make lint && make test

rebuild:
	cd client && pnpm install && pnpm run build
	cd server && pnpm install

rebuild-clean:
	cd client && pnpm install --frozen-lockfile && pnpm run build
	cd server && pnpm install --frozen-lockfile

format:
	cd client && pnpm format && cd .. && cd server && pnpm format

lint:
	cd server && pnpm tsc

test:
	cd server && pnpm test
