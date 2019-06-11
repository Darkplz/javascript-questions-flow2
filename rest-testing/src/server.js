const createApplication = require('./app')
const port = 3003


const JsonFileDB = require('./JsonFileDB')
const db = new JsonFileDB('persons.json')
app = createApplication(db)
app.listen(port)
console.log("Server started on port " + port)