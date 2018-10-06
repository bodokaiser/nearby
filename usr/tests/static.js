const supertest = require('supertest')

let app = require('../../lib')

describe('static', function() {

  it('should respond index.html', done => {
    supertest(app).get('/').expect(200, done)
  })

  it('should respond javascripts/build.js', done => {
    supertest(app).get('/javascripts/build.js').expect(200, done)
  })

})
