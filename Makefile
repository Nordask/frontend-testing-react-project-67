install:
	npm ci
page-loader:
	npx babel-node bin/page-loader -o ./__fixtures__ https://ru.hexlet.io/courses
lint:
	npm run eslint .
publish:
	npm publish --dry-run
test:
	DEBUG=page-loader npm run test
link:
	sudo npm link