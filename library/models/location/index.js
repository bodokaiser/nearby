var mongoose = require('mongoose');

module.exports = function(app) {

    var schema = new mongoose.Schema({

        geometry: {

            type: {
                type: String,
                default: 'Point'
            },
            
            coordinates: {
                type: Array,
                default: []        
            }

        }
    
    });

    require('./statics')(app, schema);
    require('./methods')(app, schema);
    
    mongoose.model('Location', schema);

};
