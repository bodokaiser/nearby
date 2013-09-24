MOCHA_FLAGS = --reporter spec

start:
	@node library/index

install: install-npm install-component

test: test-static

install-npm:
	@npm install

install-component:
	./node_modules/.bin/component install

test-static:
	./node_modules/.bin/mocha $(MOCHA_FLAGS) \
		tests/static
