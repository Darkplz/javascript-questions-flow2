const express = require('express');
const cors = require('cors');
const bookRouter = require('./bookRouter');
const mongooseConnect = require('./mongooseConnect');

const app = express();
mongooseConnect();
app.use(cors());
app.use('/books', bookRouter);

const PORT = 3006;
app.listen(PORT, function (err) {
    if(err)
        console.error(err);
    else
        console.log(`server listening on ${PORT}`);
});