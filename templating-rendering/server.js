const express = require('express')
const port = 3004
const app = express()
const hbs = require( 'express-handlebars');

app.use(express.static('./public'))
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));

app.get('/', function(req, res) {
    res.render('home', {layout: 'default'})
});

app.get('/dynamic', function(req, res) {
    
    const words = [
        "Mit",
        "Navn",
        "Er",
        "Steven"
    ];
    
    res.render('dynamic', {layout: 'default', words})
});

app.listen(port)
console.log(`Listening on port ${port}`)
