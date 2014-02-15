MOCHA = node_modules/.bin/mocha

MOCHA_FLAGS = \
		--reporter spec

boot:
	@node lib

test:
	$(MOCHA) $(MOCHA_FLAGS) test

.PHONY: test
