const fs = require('fs')

class Book {

    constructor(initialArray) {
        this.initialArray = initialArray;
        this.reset();
    }

    reset() {
        this.books = {}
        this.initialArray.forEach(initialBook => {
            this.books[initialBook.id] = { ...initialBook }
        })
    }

    async all() {
        return Object.values(this.books)
    }

    async clear() {
        this.books = {}
    }

    async get(id) {
        const found = this.books[id]
        if (!found)
            return null;

        return { ...found }
    }

    async add(book) {
        book.id = this.__randomId()
        this.books[book.id] = book
        return book
    }

    async put(id, book) {
        const found = await this.get(id)
        if (!found)
            return null

        Object.keys(found).forEach(key => {
            if (book[key] != undefined) {
                found[key] = book[key]
            }
        })
        return { ...found }
    }

    async delete(idToDelete) {
        const found = this.get(idToDelete)
        if (found) {
            delete this.books[idToDelete]
            return found
        }

        return null
    }

    __randomId() {
        var text = "";
        var possible = "abcdef0123456789";
        for (var i = 0; i < 24; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

module.exports = Book