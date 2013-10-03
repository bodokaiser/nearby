module.exports = function(app) {

    app.configure('production', function() {
        require('./builder')(app).doBuild();
    });

    app.configure('development', function() {
        app.use(require('./middleware')(app));
    });

};
