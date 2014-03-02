var util    = require('util');
var uuid    = require('uuid');
var lodash  = require('lodash');
var exempel = require('exempel');

var Position = require('./position');

function Agent(source) {
  exempel.Model.call(this, source);

  if (!this.has('uuid')) {
    this.set('uuid', uuid.v4());
  }

  this.marker = new google.maps.Marker({
    position: this.toLatLng()
  });

  listenToChangeEvent(this);
}

util.inherits(Agent, exempel.Model);

Agent.prototype.sameGeo = function(geometry) {
  return lodash.isEqual(this.get('geometry'), geometry);
};

Agent.prototype.toLatLng = function() {
	var position = new Position(this.get('geometry'));

  return position.toGoogleLatLng();
};

module.exports = Agent;

function listenToChangeEvent(model) {
  model.on('change:geometry', function(geometry) {
    if (geometry === null) {
      return model.remove();
    }

    model.marker.setPosition(model.toLatLng());
  });
}
