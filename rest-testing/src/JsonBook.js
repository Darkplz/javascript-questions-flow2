const fs = require('fs')

class JsonBook {

    constructor(file) {
        this.file = file;
        this.books = {};
        JSON.parse(fs.readFileSync(file, 'utf-8')).forEach(book => {
            if (book)
                this.books[book.id] = book
        })
    }

    async all() {
        return Object.values(this.books)
    }

    async clear() {
        this.books = {}
        await this.__save()
    }

    async get(id) {
        return this.books[id]
    }

    async add(book) {
        book.id = this.__randomId()
        this.books[book.id] = book
        this.__save()
        return book
    }

    async put(id, book) {
        const found = await this.books[id]
        if (!found)
            return null

        Object.keys(found).forEach(key => {
            if (book[key] != undefined) {
                found[key] = book[key]
            }
        })
        this.__save()
        return found
    }

    async delete(idToDelete) {
        return new Promise((resolve, error) => {
            for (let [id, book] of Object.entries(this.books)) {
                if (book && book.id == idToDelete) {
                    delete this.books[id]
                    this.__save()
                    resolve(book)
                    return;
                }
            }

            resolve(null)
        })
    }

    async __save() {
        fs.writeFileSync(this.file, JSON.stringify(this.books), 'utf-8')
    }

    __randomId() {
        var text = "";
        var possible = "abcdef0123456789";
        for (var i = 0; i < 24; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

module.exports = JsonBook