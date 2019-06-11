function createApplication(persons) {

    const express = require('express')
    const app = express()

    app.set('json spaces', 2)
    app.use(express.json())

    app.get('/persons', async function (req, res) {
        const result = await persons.all()
        res.json(result)
    })

    app.get('/persons/:id', async function (req, res) {
        const result = await persons.get(req.params.id)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find person"
            })
        } else {
            res.json(result)
        }
    })

    app.post('/persons', async function (req, res) {
        const result = await persons.add(req.body)
        res.status(201)
        res.json(result)
    })

    app.put('/persons/:id', async function (req, res) {
        const result = await persons.put(req.params.id, req.body)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find person"
            })
        } else {
            res.json(result)
        }
    })

    app.delete('/persons/:id', async function (req, res) {
        const result = await persons.delete(req.params.id)
        if (!result) {
            res.status(404)
            res.json({
                message: "Could not find person"
            })
        } else {
            res.json(result)
        }
    })

    return app
}

module.exports = createApplication