MOCHA 		 = node_modules/.bin/mocha
SUPERVISOR = node_modules/.bin/supervisor

MOCHA_FLAGS = \
		--reporter spec

SUPERVISOR_FLAGS = \
		--watch etc,lib \
		--extensions js,json

boot:
	$(SUPERVISOR) $(SUPERVISOR_FLAGS) lib

test:
	$(MOCHA) $(MOCHA_FLAGS) test

.PHONY: test
