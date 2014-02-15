var path     = require('path');
var lodash   = require('lodash');
var express  = require('express');
var packpath = require('packpath');

const GENERAL     = require('../../etc/general');
const PRODUCTION  = require('../../etc/production');
const DEVELOPMENT = require('../../etc/development');

module.exports = function(app) {

  app.configure(function() {
    lodash.merge(app.settings, lodash.cloneDeep(GENERAL));
  });

  app.configure('production', function() {
    app.use(express.logger());
    app.use(express.compress());

    lodash.merge(app.settings, lodash.cloneDeep(PRODUCTION));
  });

  app.configure('development', function() {
    lodash.merge(app.settings, lodash.cloneDeep(DEVELOPMENT));
  });

  app.configure(function() {
    lodash.forIn(app.settings, function resolve(value, index, source) {
      if (lodash.isArray(value)) {
        return lodash.forEach(value, resolve);
      }
      if (lodash.isPlainObject(value)) {
        return lodash.forIn(value, resolve);
      }
      if (lodash.isString(value) && !value.indexOf('/')) {
        source[index] = path.join(packpath.self(), value);
      }
    });
  });

};
