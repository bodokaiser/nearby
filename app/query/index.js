var element = document.querySelector('#map');

module.exports = function(app) {

    app('*', function(context, next) {
        context.element = element;

        next();
    });

};
