MOCHA     = node_modules/.bin/mocha
COMPONENT = node_modules/.bin/component

start: install build
	@node library/index

test:
	$(MOCHA) --reporter spec tests/static

build:
	$(COMPONENT) build -o public/build -n build

install:
	$(COMPONENT) install
