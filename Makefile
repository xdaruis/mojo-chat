.PHONY: $(MAKECMDGOALS)

all: build format lint test

build:
	cd client && pnpm install && pnpm run build
	cd server && pnpm install

# Builds client and server using exact versions from lockfile
build-clean:
	cd client && pnpm install --frozen-lockfile && pnpm run build
	cd server && pnpm install --frozen-lockfile

# Creates a production-ready build without development dependencies
build-prod:
	cd client && pnpm install --frozen-lockfile
	cd client && pnpm run build
	rm -rf client/node_modules
	cd server && pnpm install --prod --frozen-lockfile

format:
	cd client && pnpm format && cd .. && cd server && pnpm format && \
	pnpm prisma format

lint:
	cd server && pnpm tsc

test:
	cd server && pnpm prisma generate
	cd server && node ./test/populateDb.js && pnpm test

# Runs tests, then removes dev dependencies for a small production image
test-prod:
	cd server && pnpm install --frozen-lockfile
	cd server && pnpm prisma generate
	cd server && node ./test/populateDb.js && pnpm test
	cd server && pnpm prune --prod
