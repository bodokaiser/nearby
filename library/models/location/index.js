var mongoose = require('mongoose');

module.exports = function(app) {

    var schema = new mongoose.Schema({
        
        geometry: {
            type: String,
            coordinates: Array
        }
    
    });

    mongoose.model('Location', schema);

};
