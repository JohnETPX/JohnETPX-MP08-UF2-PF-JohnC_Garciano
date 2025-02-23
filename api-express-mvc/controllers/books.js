// Importamos el modelo de datos
const Library = require('../models/Library')

// Declaración de controladores 
const getBooks = (async (req, res) => {
    try {
        // Instanciamos un modelo Library
        let library = new Library({});
        // Lo usamos para listar libros
        let books = await library.listAll();
        res.json(books);
        library.close();
    }
    catch {
        res.json("Error getting books...");
    }
})

const createBook = (async (req, res) => {
    try {
        // Instanciamos un modelo Library
        let library = new Library({});

        // Creamos un libro nuevo
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year
        };

        // Usamos el modelo Library para crear libro
        let created = await library.create(newBook);

        if (created) {
            console.log("Product created successfully")
            res.json("Product created successfully")
        }
        else {
            console.log("Error creating new book...")
            res.json("Error creating new book...");
        }
        library.close()
    }
    catch {
        console.log("Error creating new book...")
        res.json("Error creating new book...");
    }

})

const updateBook = (async (req, res) => {
    try {
        console.log("Received update request for book ID:", req.params.id);
        console.log("Updated data:", req.body);
        // Instanciamos un modelo Library
        let library = new Library();

        // Obtenemos el ID del libro a actualizar y los nuevos datos
        const bookId = req.body.id;

        // Obtenemos los nuevos datos del libro desde el cuerpo de la solicitud
        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year
        };

        // Usamos el modelo Library para actualizar el libro
        let updated = await library.update(bookId, updatedBook);

        if (updated) {
            console.log("Book updated successfully");
            res.json("Book updated successfully");
        } else {
            console.log("Error updating the book...");
            res.json("Error updating the book...");
        }

        // Cerramos la conexión
        library.close();
    } catch (error) {
        console.log("Error updating the book...");
        res.json("Error updating the book...");
    }
})

const deleteBook = (async (req, res) => {
    try {
        let library = new Library();

        // Obtenemos el ID del libro a borrar
        const bookId = req.body.id;

        // Usamos el modelo Library para borrar el libro
        let deleteBook = await library.delete(bookId);

        if (deleteBook) {
            console.log("Book deleted successfully");
            res.json("Book deleted successfully");
        } else {
            console.log("Error deleted the book...");
            res.json("Error deleted the book...");
        }

        library.close();
    } catch (error) {
        console.log("Error deleting the book...");
        res.json("Error deleting the book...");
    }
});

module.exports = {
    getBooks: getBooks,
    createBook: createBook,
    updateBook: updateBook,
    deleteBook: deleteBook
}