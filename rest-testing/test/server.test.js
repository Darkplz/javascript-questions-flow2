const createApplication = require('../src/app')
const Book = require('./MemoryBook')

const bookA = {
    "id": "a_id",
    "name": "a_name",
    "email": "a_emai",
    "phone": "a_phone",
    "address": "a_address"
}
const bookB = {
    "id": "b_id",
    "name": "b_name",
    "email": "b_emai",
    "phone": "b_phone",
    "address": "b_address"
}
const bookC = {
    "id": "c_id",
    "name": "c_name",
    "email": "c_emai",
    "phone": "c_phone",
    "address": "c_address"
}

const books = new Book([bookA, bookB, bookC])
const app = createApplication(books)
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('Restful book api', function () {

    before(function (done) {
        this.server = app.listen(3004, function () {
            done()
        });
    });

    beforeEach(function (done) {
        books.reset()
        done()
    })

    it('GET /books should return a list of books', function (done) {
        chai.request(this.server)
            .get('/books')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.have.length(3)
                expect(res.body[0]).to.be.eql(bookA)
                expect(res.body[2]).to.be.eql(bookC)
                done()
            })
    })

    it('GET /books/:id should return a single book from an id.', function (done) {
        chai.request(this.server)
            .get('/books/a_id')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.be.eql(bookA)
                done()
            })
    })

    it('GET /books/:id should return null when the provided id does not exist.', function (done) {
        chai.request(this.server)
            .get('/books/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.be.eql({
                    message: 'Could not find book'
                })
                done()
            })
    })

    it('POST /books should create a new book', function (done) {
        const toSubmit = {
            "name": "d_name",
            "email": "d_emai",
            "phone": "d_phone",
            "address": "d_address"
        }
        chai.request(this.server)
            .post('/books')
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

    it('PUT /books/:id should should behave on unknown book id', function (done) {
        chai.request(this.server)
            .put('/books/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.eql({
                    message: 'Could not find book'
                })
                done()
            })
    })

    it('PUT /books/:id should update an existing book', function (done) {

        const toUpdate = {
            name: 'new_a_name'
        }
        chai.request(this.server)
            .put('/books/a_id')
            .send(toUpdate)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.have.property('name', 'new_a_name')
                done()
            })
    })

    it('DELETE /books/:id should behave on unknown book id.', function (done) {
        chai.request(this.server)
            .delete('/books/does_not_exist')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404)
                expect(res).to.be.json;
                expect(res.body).to.eql({
                    message: 'Could not find book'
                })
                done()
            })
    })

    it('DELETE /books/:id should delete the book with the provided id.', function (done) {

        expect(books.get('a_id')).not.to.be.null; // before

        chai.request(this.server)
            .delete('/books/a_id')
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.eql(bookA)
                const found = await books.get('a_id')
                expect(found).to.be.null; // after
                done()
            })
    })

    after(function () {
        this.server.close()
    });
});