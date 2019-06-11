const express = require('express')
const serverDebug = require('debug')('app:http:server')
const requestDebug = require('debug')('app:http:request')
const calculatorDebug = require('debug')('app:calculator')
const Calculator = require('./Calculator')

console.log("DEBUG=" + process.env.DEBUG)

const port = 3000;
const app = express()
const calculator = new Calculator()

app.set('json spaces', 4)

function handle(op, req, res) {
    
    console.log(calculator)
    const method = calculator[op]
    console.log(method)
    if (!method) {
        calculatorDebug(`Could not find method ${op}`)
        res.json({error: "Cannot find method"})
        return null
    }

    const x = parseFloat(req.params.x);
    const y = parseFloat(req.params.y);
    const result = method(x, y)
    
    calculatorDebug(`${x} ${op} ${y} equals ${result}`)

    res.json({op, x, y, result})
}

app.use((req, res, next) => {
    requestDebug(`Incoming request ${req.url}`)
    next()
});

app.get('/:op/:x/:y', (req, res) => {
    handle(req.params.op, req, res)
});

app.listen(port)
serverDebug(`Server listening on port ${port}.`)