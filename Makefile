MOCHA      = node_modules/.bin/mocha
BROWSERIFY = node_modules/.bin/browserify

MOCHA_FLAGS = \
		--reporter spec

BROWSERIFY_FLAGS = \
		--entry app/index.js \
		--outfile public/javascripts/build.js
start:
	@node lib

test: test-lib

test-lib:
	$(MOCHA) $(MOCHA_FLAGS) \
		test/lib/static

build:
	$(BROWSERIFY) $(BROWSERIFY_FLAGS)

.PHONY: test
