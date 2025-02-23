const { MongoClient, ObjectId } = require('mongodb');
const dbConfig = require("../config/mongodb.config.js");

class Library {
    constructor() {
        this.client = new MongoClient(dbConfig.URL);
        this.dbName = dbConfig.DB;
        this.collectionName = 'booksCollection';
    }

    async connect() {
        if (!this.client.topology || !this.client.topology.isConnected()) {
            await this.client.connect();
            console.log("Successfully connected to MongoDB.");
        }
        return this.client.db(this.dbName).collection(this.collectionName);
    }

    close = async () => {
        this.client.close();
    }

    listAll = async () => {
        try {
            const collection = await this.connect();
            const books = await collection.find({}).toArray();

            // Mapeamos los libros para reemplazar _id con id y convertirlo a string
            return books.map(book => ({
                ...book,
                id: book._id.toString(),  // Convertimos ObjectId a string
                _id: undefined            // Eliminamos _id para evitar confusión
            }));
        } catch (error) {
            console.error("Error listing books:", error);
            return [];
        }
    }

    create = async (newBook) => {
        try {
            const collection = await this.connect();
            const result = await collection.insertOne(newBook);
            return result.insertedId; // Devuelve el ID del documento insertado
        } catch (error) {
            return error;
        }
    }

    update = async (id, modifiedBook) => {
        try {
            console.log("Received update request for book ID:", id);
            const collection = await this.connect();
            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: modifiedBook }
            );
            return result.modifiedCount; // Retorna el número de documentos modificados
        } catch (error) {
            return error;
        }
    }

    delete = async (id) => {
        try {
            const collection = await this.connect();
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount; // Retorna el número de documentos eliminados
        } catch (error) {
            return error;
        }
    }
}


module.exports = Library;