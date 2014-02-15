var st = require('st');

module.exports = function(app) {

	app.use(st(app.settings.static));

};
