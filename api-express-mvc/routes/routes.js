const express = require('express');
const books = require('../controllers/books.js');
const { jwtAuth, generateToken } = require('../mw/auth.js');

const router = express.Router();

// Ruta GET pública: accesible a cualquier usuario
router.get('/api/books', books.getBooks);

// Rutas protegidas: requieren JWT en la cabecera
router.post('/api/books', jwtAuth, books.createBook);
router.put('/api/books', jwtAuth, books.updateBook);
router.delete('/api/books', jwtAuth, books.deleteBook);

// Ruta de login: recibe usuario y contraseña y retorna un JWT
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await generateToken(username, password);
  if (result.error) {
    return res.status(401).json(result);
  }
  res.json(result);
});

module.exports = router;
