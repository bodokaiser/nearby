module.exports = function(app, schema) {

    schema.method('updateGeometryAndFindAll', function(geometry, callback) {
        var self = this;

        self.geometry = geometry;

        self.save(function(err, doc) {
            if (err) return callback(err);

            self.constructor.find(function(err, docs) {
                if (err) return callback(err);

                callback(null, docs);
            });
        });
    });

    schema.method('removeAndFindAll', function(callback) {
        var self = this;

        self.remove(function(err, doc) {
            if (err) return callback(err);

            self.constructor.find(function(err, docs) {
                if (err) return callback(err);

                callback(null, docs);
            });
        });
    });

};
