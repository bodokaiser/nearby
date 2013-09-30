var GeoServer = require('./server');

module.exports = function(app) {

    var geoserver = new GeoServer();

    geoserver.listen(app.server);

};
