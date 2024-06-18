install:
	npm ci

page-loader:
	npx babel-node bin/page-loader -o ./__fixtures__ https://ru.hexlet.io/courses

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