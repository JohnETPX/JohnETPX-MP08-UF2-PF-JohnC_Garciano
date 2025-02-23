const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require("mysql2");
const dbConfig = require("../config/mysql.config.js");

// Creamos la conexión a MySQL
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
const db = connection.promise();
// Clave secreta (guárdala en .env)
const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto123';

// Función para autenticar usuario y generar JWT
const generateToken = async (username, password) => {
    try {
        const [rows] = await db.execute('SELECT id, username, password FROM users WHERE username = ? ', [username]);
        if (rows.length === 0) {
            return { error: 'Usuario no encontrado' };
        }
        const user = rows[0];
        // Comparar contraseña con la almacenada en MySQL
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: 'Contraseña incorrecta' };
        }
        // Generar JWT con datos del usuario
        const payload = { username: user.username };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        return { token };
    } catch (err) {
        console.error('Error en autenticación:', err);
        return { error: 'Error interno del servidor' };
    }
};

const jwtAuth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            error: 'Acceso denegado. Token requerido.'
        });
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = {jwtAuth, generateToken};