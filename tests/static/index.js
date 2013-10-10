var should    = require('should');
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

});
