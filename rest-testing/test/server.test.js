const createApplication = require('../src/app')
const MemoryDB = require('./MemoryDB')

const personA = {
    "id": "a_id",
    "name": "a_name",
    "email": "a_emai",
    "phone": "a_phone",
    "address": "a_address"
}
const personB = {
    "id": "b_id",
    "name": "b_name",
    "email": "b_emai",
    "phone": "b_phone",
    "address": "b_address"
}
const personC = {
    "id": "c_id",
    "name": "c_name",
    "email": "c_emai",
    "phone": "c_phone",
    "address": "c_address"
}

const memoryDB = new MemoryDB([personA, personB, personC])
const app = createApplication(memoryDB)
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('Restful person api', function () {

    before(function (done) {
        this.server = app.listen(3004, function () {
            done()
        });
    });

    beforeEach(function (done) {
        memoryDB.reset()
        done()
    })

    it('GET /persons should return a list of persons', function (done) {
        chai.request(this.server)
            .get('/persons')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.have.length(3)
                expect(res.body[0]).to.be.eql(personA)
                expect(res.body[2]).to.be.eql(personC)
                done()
            })
    })

    it('GET /persons/:id should return a single person from an id.', function (done) {
        chai.request(this.server)
            .get('/persons/a_id')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.be.eql(personA)
                done()
            })
    })

    it('GET /persons/:id should return null when the provided id does not exist.', function (done) {
        chai.request(this.server)
            .get('/persons/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.be.eql({
                    message: 'Could not find person'
                })
                done()
            })
    })

    it('POST /persons should create a new person', function (done) {
        const toSubmit = {
            "name": "d_name",
            "email": "d_emai",
            "phone": "d_phone",
            "address": "d_address"
        }
        chai.request(this.server)
            .post('/persons')
            .send(toSubmit)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201)
                expect(res).to.be.json;
                expect(res.body).to.have.property('id')
                Object.keys(toSubmit).forEach(k => {
                    expect(res.body).to.have.property(k, toSubmit[k])
                })
                done()
            })
    })

    it('PUT /persons/:id should should behave on unknown person id', function (done) {
        chai.request(this.server)
            .put('/persons/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.eql({
                    message: 'Could not find person'
                })
                done()
            })
    })

    it('PUT /persons/:id should update an existing person', function (done) {

        const toUpdate = {
            name: 'new_a_name'
        }
        chai.request(this.server)
            .put('/persons/a_id')
            .send(toUpdate)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.have.property('name', 'new_a_name')
                done()
            })
    })

    it('DELETE /persons/:id should behave on unknown person id.', function (done) {
        chai.request(this.server)
            .delete('/persons/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.eql({
                    message: 'Could not find person'
                })
                done()
            })
    })

    it('DELETE /persons/:id should delete the person with the provided id.', function (done) {

        expect(memoryDB.get('a_id')).not.to.be.null; // before

        chai.request(this.server)
            .delete('/persons/a_id')
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.eql(personA)
                const found = await memoryDB.get('a_id')
                expect(found).to.be.null; // after
                done()
            })
    })

    after(function () {
        this.server.close()
    });
});