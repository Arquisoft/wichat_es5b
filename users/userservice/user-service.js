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
        let query = { username: req.body.username.toString() };
        const existingUser = await User.findOne(query);
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

    app.post('/updateusername', async (req, res) => {
      try {
        const { userId, newUsername } = req.body;
    
        validateRequiredFields(req, ['newUsername']);
        
        // Buscar usuario actual
        console.log("ID del usuario:", req.body.userId);
        let query = { _id: userId.toString() };
        const user = await User.findOne(query);
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const username = user.username;
        // Actualizar el nombre si se proporciona
        if (newUsername && newUsername !== username) {
          const usernameTaken = await User.findOne({ username: newUsername });
          if (usernameTaken) {
            return res.status(400).json({ error: "El nuevo nombre de usuario ya está en uso" });
          }
          user.username = newUsername;
        }
    
        await user.save();

        res.json({ message: "Usuario actualizado correctamente"});
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Ruta POST para actualizar la contraseña
    app.post('/updatepassword', async (req, res) => {
      try {
          const {userId, oldPassword, newPassword, confirmPassword } = req.body;

          // Validación de campos
          validateRequiredFields(req, ['userId', 'oldPassword', 'newPassword', 'confirmPassword']);

          // Buscar al usuario en la base de datos
          let query = { _id: userId.toString() };
          const user = await User.findOne(query);

          if (!user) {
              return res.status(404).json({ error: 'Usuario no encontrado' });
          }

          // Verificar la contraseña actual (oldPassword)
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
              return res.status(400).json({ error: 'Contraseña actual incorrecta' });
          }

          validatePassword(newPassword);

          if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
          }

      
          // Encriptar la nueva contraseña
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);

          // Actualizar la contraseña en la base de datos
          user.password = hashedPassword;
          await user.save();

          return res.status(200).json({ message: 'Contraseña actualizada correctamente' });

      } catch (error) {
          console.error(error);
          return res.status(500).json({ error: error.message });
      }
    });
    

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server