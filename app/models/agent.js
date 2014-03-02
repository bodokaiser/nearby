var util    = require('util');
var uuid    = require('uuid');
var lodash  = require('lodash');
var exempel = require('exempel');

var Position = require('./position');

function Agent(source) {
  exempel.Model.call(this, source);

  // will create an identifier (required for own agent)
  if (!this.has('uuid')) {
    this.set('uuid', uuid.v4());
  }

  // will create an empty marker for this agent
  this.marker = new google.maps.Marker({
    position: this.toLatLng()
  });

  // will listen on geometry changes
  listenToChangeEvent(this);
}

util.inherits(Agent, exempel.Model);

Agent.prototype.sameGeo = function(geometry) {
  return lodash.isEqual(this.get('geometry'), geometry);
};

Agent.prototype.toLatLng = function() {
  // this is a helper to convert agent to google maps
  // compatible position representation
	var position = new Position(this.get('geometry'));

  return position.toGoogleLatLng();
};

module.exports = Agent;

function listenToChangeEvent(model) {
  model.on('change:geometry', function(geometry) {
    // when geometry was set to null by the server
    // this agent has been disconnected
    if (geometry === null) {
      return model.remove();
    }

    // else it just had updated its position
    model.marker.setPosition(model.toLatLng());
  });
}
