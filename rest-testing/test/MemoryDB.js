const fs = require('fs')

class MemoryDB {

    constructor(initialArray) {
        this.initialArray = initialArray;
        this.reset();
    }

    reset() {
        this.persons = {}
        this.initialArray.forEach(initialPerson => {
            this.persons[initialPerson.id] = { ...initialPerson }
        })
    }

    async all() {
        return Object.values(this.persons)
    }

    async clear() {
        this.persons = {}
    }

    async get(id) {
        const found = this.persons[id]
        if (!found)
            return null;

        return { ...found }
    }

    async add(person) {
        person.id = this.__randomId()
        this.persons[person.id] = person
        return person
    }

    async put(id, person) {
        const found = await this.get(id)
        if (!found)
            return null

        Object.keys(found).forEach(key => {
            if (person[key] != undefined) {
                found[key] = person[key]
            }
        })
        return { ...found }
    }

    async delete(idToDelete) {
        const found = this.get(idToDelete)
        if (found) {
            delete this.persons[idToDelete]
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

module.exports = Person