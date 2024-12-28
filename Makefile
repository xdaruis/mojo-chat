format:
	cd client && npm run format && cd .. && cd server && npm run format

lint:
	npm run tsc

test:
	cd server && npm run test
