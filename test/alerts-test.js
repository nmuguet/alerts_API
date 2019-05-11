const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../app')

chai.should()
chai.use(chaiHttp)

//CORRIGER DONE ?


describe('Alerts tests', () => {

    it('should list a SINGLE alerts on /alerts/<id> GET', done => {
        chai
            .request(app)
            .get('/alerts/all')
            .end((err, res) => {
                const id = res.body.alertes[0]._id
                chai
                    .request(app)
                    .get('/alerts/' + id)
                    .end((err, res) => {
                        res
                            .should
                            .have
                            .status(200)
                        res.should.be.json
                        res
                            .body
                            .should
                            .be
                            .a('object')
                        res
                            .body
                            .should
                            .have
                            .property('_id')
                        res
                            .body
                            ._id
                            .should
                            .equal(id)
                        done()
                    })
            })
    })

    it('should return a INVALID ID error on /alerts/<id> GET', done => {
        chai
            .request(app)
            .get('/alerts/wrongIdFormat')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(400)
                res.should.be.json
                res
                    .body
                    .should
                    .have
                    .property('message')
                res
                    .body
                    .message
                    .should
                    .equal('Invalid ID supplied')
                done()
            })
    })

    it('should list a INEXISTANT alerts on /alerts/<id> GET', done => {
        chai
            .request(app)
            .get('/alerts/5cd4284496acd8inexistant')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(404)
                res.should.be.json
                res
                    .body
                    .should
                    .have
                    .property('message')
                res
                    .body
                    .message
                    .should
                    .equal('Alert not found')
                done()
            })
    })


    it('should list alerts corresponding to SINGLE CRITERIA on /alerts/search GET', done => {
        chai
            .request(app)
            .get('/alerts/search?status=threat')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(200)
                res.should.be.json
                res
                    .body
                    .should
                    .be
                    .a('Array')
                res
                    .body[0]
                    .should
                    .have
                    .property('status')
                res
                    .body[0]
                    .status
                    .should
                    .equal('threat')
                done()
            })
    })

    it('should list alerts corresponding to MULTIPLES CRITERIAS on /alerts/search GET', done => {
        chai
            .request(app)
            .get('/alerts/search?status=threat,warning')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(200)
                res.should.be.json
                res
                    .body
                    .should
                    .be
                    .a('Array')
                res
                    .body[0]
                    .should
                    .have
                    .property('status')
                done()
            })
    })

    it('(WRONG TAG) should return a invalid tag error on /alerts/search GET', done => {
        chai
            .request(app)
            .get('/alerts/search?wrongTag=threat,warning')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(400)
                res.should.be.json
                res
                    .body
                    .should
                    .have
                    .property('message')
                res
                    .body
                    .message
                    .should
                    .equal('Invalid tag value')
                done()
            })
    })

    it('(TAG BUT NO CRITERIA) should return a invalid tag error on /alerts/search GET', done => {
        chai
            .request(app)
            .get('/alerts/search?status=')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(400)
                res.should.be.json
                res
                    .body
                    .should
                    .have
                    .property('message')
                res
                    .body
                    .message
                    .should
                    .equal('Invalid tag value')
                done()
            })
    })

    it('(NO TAG) should return a invalid tag error on /alerts/search GET', done => {
        chai
            .request(app)
            .get('/alerts/search')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(400)
                res.should.be.json
                res
                    .body
                    .should
                    .have
                    .property('message')
                res
                    .body
                    .message
                    .should
                    .equal('Invalid tag value')
                done()
            })
    })

    it('should add a SINGLE alert on /alerts POST', done => {
        chai
            .request(app)
            .post('/alerts')
            .send({ type: 'transport', label: 'chai alert', status: 'threat', from: 'saturday', to: 'sunday' })
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(200)
                res.should.be.json
                res
                    .body
                    .should
                    .be
                    .a('object')
                res
                    .body
                    .should
                    .have
                    .property('type')
                res
                    .body
                    .type
                    .should
                    .equal('transport')
                res
                    .body
                    .should
                    .have
                    .property('label')
                res
                    .body
                    .label
                    .should
                    .equal('chai alert')
                res
                    .body
                    .should
                    .have
                    .property('status')
                res
                    .body
                    .status
                    .should
                    .equal('threat')
                res
                    .body
                    .should
                    .have
                    .property('from')
                res
                    .body
                    .from
                    .should
                    .equal('saturday')
                res
                    .body
                    .should
                    .have
                    .property('to')
                res
                    .body
                    .to
                    .should
                    .equal('sunday')
                done()
            })
    })


    it('should add a INVALID alert on /alerts POST', done => {
        chai
            .request(app)
            .post('/alerts')
            .send({ type: 'sea', label: 'Invalid chai alert', wrongParam: 'threat', from: 'saturday', to: 'sunday' })
            .end((err, res) => {
                res.should.be.json
                res
                    .should
                    .have
                    .status(405)
                res
                    .body
                    .message
                    .should
                    .equal('Invalid input')
                done()
            })
    })

    it('should add an EMPTY alert on /alerts POST', done => {
        chai
            .request(app)
            .post('/alerts')
            .end((err, res) => {
                res.should.be.json
                res
                    .should
                    .have
                    .status(405)
                res
                    .body
                    .message
                    .should
                    .equal('Invalid input')
                done()
            })
    })

    it('should update a SINGLE alert on /alerts/<id> PUT', done => {
        chai
            .request(app)
            .get('/alerts/all')
            .end((err, res) => {
                const id = res.body.alertes[0]._id
                chai
                    .request(app)
                    .put('/alerts/' + id)
                    .send({ type: 'transport', label: 'chai updated alert', status: 'threat', from: 'saturday', to: 'sunday' })
                    .end((err, res) => {
                        console.log(res.body)
                        res
                            .should
                            .have
                            .status(200)
                        res.should.be.json
                        res
                            .body
                            .should
                            .be
                            .a('object')
                        res
                            .body
                            .should
                            .have
                            .property('_id')
                        res
                            .body
                            ._id
                            .should
                            .equal(id)
                        res
                            .body
                            .label
                            .should
                            .equal('chai updated alert')
                        done()
                    })
            })
    })

    it('should update a alert with wrong parameters on /alerts/<id> PUT', done => {
        chai
            .request(app)
            .get('/alerts/all')
            .end((err, res) => {
                const id = res.body.alertes[0]._id
                chai
                    .request(app)
                    .put('/alerts/' + id)
                    .send({ type: 'sea', label: 'Invalid chai alert', wrongParam: 'threat', from: 'saturday', to: 'sunday' })
                    .end((err, res) => {
                        res.should.be.json
                        res
                            .should
                            .have
                            .status(405)
                        done()
                    })
            })
    })


    it('should update a UNKNOW alert on /alerts/<id> PUT', done => {
        chai
            .request(app)
            .put('/alerts/5cd4287fbe6ababaaaaaaabb')
            .send({ type: 'transport', label: 'chai updated alert', status: 'threat', from: 'saturday', to: 'sunday' })
            .end((err, res) => {
                res.should.be.json
                res
                    .should
                    .have
                    .status(405)
                done()
            })
    })

    it('should delete a SINGLE alert on /alerts/<id> DELETE', done => {
        chai
            .request(app)
            .get('/alerts/all')
            .end((err, res) => {
                const id = res.body.alertes[1]._id
                chai
                    .request(app)
                    .delete('/alerts/' + id)
                    .end((err, res) => {
                        res
                            .should
                            .have
                            .status(200)
                        done()
                    })
            })
    })

    it('should delete a UNKNOWN alert on /alerts/<id> DELETE', done => {
        chai
            .request(app)
            .delete('/alerts/5cd4287fbe6ababaaaaaaaaa')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(404)
                done()
            })
    })

    it('should delete a wrong format ID alert on /alerts/<id> DELETE', done => {
        chai
            .request(app)
            .delete('/alerts/bad')
            .end((err, res) => {
                res
                    .should
                    .have
                    .status(400)
                done()
            })
    })
})