const fs = require('fs')

class JsonPerson {

    constructor(file) {
        this.file = file;
        this.persons = {};
        JSON.parse(fs.readFileSync(file, 'utf-8')).forEach(person => {
            if (person)
                this.persons[person.id] = person
        })
    }

    async all() {
        return Object.values(this.persons)
    }

    async clear() {
        this.persons = {}
        await this.__save()
    }

    async get(id) {
        return this.persons[id]
    }

    async add(person) {
        person.id = this.__randomId()
        this.persons[person.id] = person
        this.__save()
        return person
    }

    async put(id, person) {
        const found = await this.persons[id]
        if (!found)
            return null

        Object.keys(found).forEach(key => {
            if (person[key] != undefined) {
                found[key] = person[key]
            }
        })
        this.__save()
        return found
    }

    async delete(idToDelete) {
        return new Promise((resolve, error) => {
            for (let [id, person] of Object.entries(this.persons)) {
                if (person && person.id == idToDelete) {
                    delete this.persons[id]
                    this.__save()
                    resolve(person)
                    return;
                }
            }

            resolve(null)
        })
    }

    async __save() {
        fs.writeFileSync(this.file, JSON.stringify(this.persons), 'utf-8')
    }

    __randomId() {
        var text = "";
        var possible = "abcdef0123456789";
        for (var i = 0; i < 24; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}

module.exports = JsonPerson