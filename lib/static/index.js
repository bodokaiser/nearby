var express = require('express');

module.exports = function(app) {

    var prefix = __dirname + '/../..';

    app.use(express.static(prefix + app.settings.static.path));

};
