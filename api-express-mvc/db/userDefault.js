const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const dbConfig = require('../config/mysql.config');

const saltRounds = 10;
const plainPassword = "123";

// Creamos la conexión a MySQL
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
const db = connection.promise();

// Hasheamos la contraseña y realizamos la inserción
bcrypt.hash(plainPassword, saltRounds, async (err, hash) => {
  if (err) {
    console.error("Error generando hash:", err);
    process.exit(1);
  }
  try {
    const [result] = await db.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["john", hash]
    );
    console.log("Usuario insertado exitosamente:", result);
  } catch (error) {
    console.error("Error insertando usuario:", error);
  } finally {
    connection.end();
  }
});
