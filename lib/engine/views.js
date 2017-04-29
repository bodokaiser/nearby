var jade = require('jade');

module.exports = app => {

  var options = app.settings.engine.views;

  app.configure(() => {
    app.set('views', options.path);
    app.set('view engine', options.engine);
    app.set('view options', options.locals);

    app.engine('jade', jade.renderFile);
  });

};
