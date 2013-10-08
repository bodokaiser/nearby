start: install build
	@node library/index

test:
	./node_modules/.bin/mocha --reporter spec tests/static

build:
	./node_modules/.bin/component build -o public/build -n build

install:
	./node_modules/.bin/component install
