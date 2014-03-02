var util    = require('util');
var lodash  = require('lodash');
var exempel = require('exempel');

var Agent = require('./agent');

function Agents(source) {
  this.Model = Agent;

  exempel.Collection.call(this, source);
}

util.inherits(Agents, exempel.Collection);

Agents.prototype.find = function(location) {
  var found = lodash.find(this.models, function(model) {
    return model.get('uuid') === location.uuid;
  });

  return found;
};

module.exports = Agents;
