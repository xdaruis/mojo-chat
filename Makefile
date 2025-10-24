.PHONY: $(MAKECMDGOALS)

all: build format lint test

build:
	cd client && pnpm install && pnpm run build
	cd server && pnpm install && \
	pnpm prisma migrate deploy && pnpm prisma generate

# Builds client and server using exact versions from lockfile
build-clean:
	cd client && pnpm install --frozen-lockfile && pnpm run build
	cd server && pnpm install --frozen-lockfile && \
	pnpm prisma migrate deploy && pnpm prisma generate

format:
	cd client && pnpm format && cd .. && cd server && pnpm format && \
	pnpm prisma format

lint:
	cd server && pnpm tsc

test:
	cd server && pnpm prisma generate
	cd server && node ./test/populateDb.js && pnpm test
