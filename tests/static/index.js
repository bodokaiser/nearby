var chai      = require('chai');
var supertest = require('supertest');

var app = require('../../library');

describe('static', function() {

    it('should respond index.html', function(done) {
        supertest(app)
            .get('/')
            .expect(200, done);
    });

    it('should respond javascripts/build.js', function(done) {
        supertest(app)
            .get('/javascripts/build.js')
            .expect(200, done);
    });

    it('should respond stylesheets/build.css', function(done) {
        supertest(app)
            .get('/stylesheets/build.css')
            .expect(200, done);
    });

    it('should respond stylesheets/bootstrap.css', function(done) {
        supertest(app)
            .get('/stylesheets/bootstrap.css')
            .expect(200, done);
    });

    it('should respond stylesheets/bootstrap-theme.css', function(done) {
        supertest(app)
            .get('/stylesheets/bootstrap-theme.css')
            .expect(200, done);
    });

});
