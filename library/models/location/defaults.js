module.exports = function(app, schema) {

    schema.path('geometry').default(function() {
        return { type: 'Point', coordinates: [] };
    });

};
