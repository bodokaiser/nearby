var confus  = require('confus');
var lodash  = require('lodash');
var express = require('express');

module.exports = app => {

  // will setup our configuration
  // object depending on environment
  var config = confus({
    profiles: {
      production: [
        'etc/general',
        'etc/production'
      ],
      development: [
        'etc/general',
        'etc/development'
      ]
    },
    root: __dirname + '/../../'
  });

  confus.at('production', () => {
    app.use(express.logger());
    app.use(express.compress());
  });

  lodash.merge(app.settings, config);

};
