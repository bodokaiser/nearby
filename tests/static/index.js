var should    = require('should');
var supertest = require('supertest');

var app = require('../../library');

describe('static', function() {

    it('should respond index.html', function(done) {
        supertest(app)
            .get('/')
            .expect(200, done);
    });

    it('should respond build/build.js', function(done) {
        supertest(app)
            .get('/build/build.js')
            .expect(200, done);
    });

    it('should respond build/build.css', function(done) {
        supertest(app)
            .get('/build/build.css')
            .expect(200, done);
    });

});
