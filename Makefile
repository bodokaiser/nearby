start: install build
	@node index.js

test:
	./node_modules/.bin/mocha --reporter list tests/static

build:
	./node_modules/.bin/component build -o public/build -n build

install:
	./node_modules/.bin/component install
