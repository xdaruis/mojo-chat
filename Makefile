.PHONY: $(MAKECMDGOALS)

all: build format lint test

build:
	cd client && pnpm install && pnpm run build
	cd server && pnpm install

build-clean:
	cd client && pnpm install --frozen-lockfile && pnpm run build
	cd server && pnpm install --frozen-lockfile

build-prod:
	cd client && pnpm install --frozen-lockfile
	cd client && pnpm run build
	rm -rf client/node_modules
	cd server && pnpm install --prod --frozen-lockfile

format:
	cd client && pnpm format && cd .. && cd server && pnpm format

lint:
	cd server && pnpm tsc

test:
	cd server && pnpm test

test-prod:
	cd server && pnpm install --frozen-lockfile
	cd server && pnpm test
	cd server && pnpm prune --prod
