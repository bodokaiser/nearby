module.exports = function(app) {

  require('./views')(app);

  require('./builder')(app);

};
