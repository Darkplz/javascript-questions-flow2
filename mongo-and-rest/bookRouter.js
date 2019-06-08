const express = require('express');
const bodyParser = require('body-parser');
const BookFacade = require('./BookFacade');
const router = express.Router();

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.json(await BookFacade.getAll());
});

router.get('/:id', async (req, res, next) => {
    const found = await BookFacade.getById(req.params.id);
    if (!found)
        res.status(404).json({
            message: `No book with provided id ${req.params.id}`
        });
    else
        res.json(found);
});

router.post('/', async (req, res, next) => {
    const {title, year, authors, language, pages} = req.body;
    const created = await BookFacade.create(title, year, authors, language, pages);
    res.status(201).json(created);
});

router.put('/:id', async (req, res, next) => {
    const updated = await BookFacade.update(req.params.id, req.body);

    res.json(updated);
});

router.delete('/:id', async (req, res, next) => {
    const deleted = await BookFacade.delete(req.params.id);
    console.log({deleted});
    if (!deleted){
        res.status(404);
        res.json({
            message: `No book with provided id ${req.params.id}`
        });
    } else
        res.status(200);
        res.json(deleted);
});

module.exports = router;