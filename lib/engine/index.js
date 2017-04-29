module.exports = app => {

  require('./views')(app);

  require('./builder')(app);

};
