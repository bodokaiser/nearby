var supertest = require('supertest');

var app = require('../../lib');

describe('static', () => {

  it('should respond index.html', done => {
    supertest(app).get('/').expect(200, done);
  });

  it('should respond javascripts/build.js', done => {
    supertest(app).get('/javascripts/build.js').expect(200, done);
  });

});
