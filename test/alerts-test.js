const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../app')

chai.should()
chai.use(chaiHttp)


describe('Alerts tests', () => {

    it('should list a SINGLE alerts on /alerts/<id> GET', done => {
        chai
            .request(app)
            .get('/alerts/1234')
            .end((err, res) => {

                done()
            })
    })

})
