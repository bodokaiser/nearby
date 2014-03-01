var express = require('express');

module.exports = function(app) {

  var options = app.settings.static;

	app.use(express.static(options));

};
