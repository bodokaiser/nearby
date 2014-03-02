var Agent  = require('./agent');
var Agents = require('./agents');

module.exports = function(app) {

  app.agent = new Agent();
  app.agents = new Agents();

  app.on('message', function(locations) {
    locations.forEach(function(location) {
      if (!app.agents.find(location) && location.geometry) {
        app.agents.push(new Agent(location));
      } else {
        var agent = app.agents.find(location);

        if (!agent.sameGeo(location.geometry)) {
          agent.set('geometry', location.geometry);
        }
      }
    });
  });

  app.on('position', function(position) {
    app.agent.set('geometry', position.toJSON());
  });

};
