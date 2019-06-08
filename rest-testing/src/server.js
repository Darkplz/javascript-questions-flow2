const createApplication = require('./app')
const port = 3003


const Book = require('./JsonBook')
const books = new Book('books.json')
app = createApplication(books)
app.listen(port)
console.log("Server started on port " + port)