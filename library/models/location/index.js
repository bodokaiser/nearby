var mongoose = require('mongoose');

module.exports = function(app) {

    var schema = new mongoose.Schema({
        
        geometry: {
            type: String,
            coordinates: Array
        }
    
    });

    require('./indexes')(app, schema);
    require('./methods')(app, schema);
    require('./defaults')(app, schema);
    
    mongoose.model('Location', schema);

};
