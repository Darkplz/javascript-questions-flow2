const BookModel = require('./BookModel');

module.exports = class BookFacade {

    static async getAll(){
        return BookModel.find({}).lean().exec();
    }

    static async getById(id){
        return BookModel.findById(id).lean().exec();
    }

    static async create(title, year, authors, language, pages){
        return (await BookModel.create({
            title, year, authors, language, pages
        })).toObject();
    }

    static async update(id, contents){

        const found = await BookModel.findById(id).exec();
        if(!found)
            return undefined;

        const keys = Object.keys(found.toObject());
        keys.forEach(key => {
            if(has(contents, key) && key != '_id' && key != '__v') {
                found[key] = contents[key];
                found.markModified(key);
            }
        });

        await found.save();
        return found.toObject();
    }

    static async delete(id){
        return BookModel.findByIdAndRemove(id).lean().exec();
    }
}

function has(object, key) {
    return object ? object.hasOwnProperty.call(object, key) : false;
 }