// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user-model')

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);



// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      let fieldName = field;
        if (field === 'username') {
            fieldName = 'nombre de usuario';
        } else if (field === 'password') {
            fieldName = 'contraseña';
        }

      if (!req.body[field] || req.body[field].trim() === '') {
        throw new Error(`El campo ${fieldName} es obligatorio y no puede estar vacío`);
      }
    }
}

function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos 1 mayúscula, 1 número y mínimo 6 caracteres
  if (!regex.test(password)) {
      throw new Error("La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres.");
  }
}

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        // Validar requisitos de la contraseña
        validatePassword(req.body.password);

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }});

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server