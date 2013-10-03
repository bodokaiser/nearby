module.exports = function(app, builder) {

    builder.hook('before scripts', function(package) {
        var config = JSON.stringify(app.settings.application);

        var script = 'module.exports = ' + config
 
        package.addFile('scripts', 'boot/config.js', script);
    });

};
