module.exports = function(app) {

    app.use(require('./middleware')(app));

};
