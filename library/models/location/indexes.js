module.exports = function(app, schema) {

    schema.path('geometry').index({ '2dsphere': true });

};
