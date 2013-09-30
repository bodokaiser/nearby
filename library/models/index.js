var mongoose = require('mongoose');

module.exports = function(app) {

    var url = app.settings.mongo.url;
    var options = app.settings.mongoose;    

    mongoose.connect(url, options);

    require('./location')(app);

};
