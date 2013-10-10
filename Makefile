MOCHA      = node_modules/.bin/mocha
BROWSERIFY = node_modules/.bin/browserify

BUILD_IN  = app/index.js
BUILD_OUT = public/javascripts/build.js

start:
	@node library/index

test:
	$(MOCHA) --reporter spec tests/static

build:
	$(BROWSERIFY) --entry $(BUILD_IN) --outfile $(BUILD_OUT)
