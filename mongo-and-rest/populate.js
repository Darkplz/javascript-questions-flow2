const booklist = require("./books")
const BookModel = require("./BookModel");
const mongooseConnect = require("./mongooseConnect")

mongooseConnect(async () => {
    await BookModel.insertMany(booklist);
    console.log("Populated books done")
})
