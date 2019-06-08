const mongoose = require('mongoose');
const CONNECTION_URL = require('./config').MONGO_URI;

module.exports = function connect(done) {

    const options = {
        createIndexes: true,
        useNewUrlParser: true
    };

    mongoose.connect(CONNECTION_URL, options, err => {
        if (err) {
            console.error("could not connect to MongoDB:");
            console.error(err.message);
            if (done != undefined)
                done(err);
            return;
        }

        console.log("successfully connected to MongoDB.");
        if (done != undefined)
            done(undefined);
    });
}