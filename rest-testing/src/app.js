function createApplication(books) {

    const express = require('express')
    const app = express()

    app.set('json spaces', 2)
    app.use(express.json())

    app.get('/books', async function (req, res) {
        const result = await books.all()
        res.json(result)
    })

    app.get('/books/:id', async function (req, res) {
        const result = await books.get(req.params.id)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find book"
            })
        } else {
            res.json(result)
        }
    })

    app.post('/books', async function (req, res) {
        const result = await books.add(req.body)
        res.status(201)
        res.json(result)
    })

    app.put('/books/:id', async function (req, res) {
        const result = await books.put(req.params.id, req.body)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find book"
            })
        } else {
            res.json(result)
        }
    })

    app.delete('/books/:id', async function (req, res) {
        const result = await books.delete(req.params.id)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find book"
            })
        } else {
            res.json(result)
        }
    })

    return app
}

module.exports = createApplication