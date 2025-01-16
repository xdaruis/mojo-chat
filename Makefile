all:
	make format && make rebuild && make lint && make test

rebuild:
	cd client && npm ci && npm run build && cd .. && cd server && npm ci

format:
	cd client && npm run format && cd .. && cd server && npm run format

lint:
	cd server && npm run tsc

test:
	cd server && npm run test
