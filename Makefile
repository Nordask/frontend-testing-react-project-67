install:
	npm ci
loader:
	node bin/index.js
lint:
	npm run eslint .
publish:
	npm publish --dry-run
test:
	npm run test
test-coverage:
	npm run test -- --coverage
test-watch:
	npm run test-watch
link:
	sudo npm link