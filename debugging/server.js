const express = require('express')
const serverDebug = require('debug')('http:server')
const requestDebug = require('debug')('http:request')
const calculatorDebug = require('debug')('calculator')
const Calculator = require('./Calculator')

console.log("DEBUG=" + process.env.DEBUG)

const port = 3002;
const app = express()
const calculator = new Calculator()

app.set('json spaces', 4)

function handle(op, req, res) {
    
    const method = calculator[op]
    if (!method) {
        calculatorDebug(`Could not find method ${op}`)
        res.json({error: "Cannot find method"})
        return null
    }

    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);
    const result = method(a, b)
    
    calculatorDebug(`${a} ${op} ${b} equals ${result}`)

    res.json({op, a, b, result})
}

app.use((req, res, next) => {
    requestDebug(`Incoming request ${req.url}`)
    next()
});

app.get('/add/:a/:b', (req, res) => {
    handle('add', req, res)
});

app.get('/sub/:a/:b', (req, res) => {
    handle('sub', req, res)
});

app.get('/mul/:a/:b', (req, res) => {
    handle('mul', req, res)
});

app.get('/div/:a/:b', (req, res) => {
    handle('div', req, res)
});

app.listen(port)
serverDebug(`Server listening on port ${port}.`)