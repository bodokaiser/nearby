var express = require('express');

var PATH_PREFIX = __dirname + '/../../';

module.exports = function(app) {

    var staticPath = PATH_PREFIX = app.settings.static.path;

    app.use(express.static(staticPath));

};
