var Agent  = require('./agent');
var Agents = require('./agents');

module.exports = function(app) {

  // this is our agent
  app.agent = new Agent();

  // these are all online agents
  app.agents = new Agents();

  // the server will broadcast an array of locations
  app.on('message', function(locations) {
    locations.forEach(function(location) {
      // add agent to our agent collection if not found else
      // update its geometry if this has changed since last time
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

  // update our agent when position changes
  app.on('position', function(position) {
    app.agent.set('geometry', position.toJSON());
  });

};
