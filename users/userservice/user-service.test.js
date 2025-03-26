const request = require('supertest');
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./user-model');


let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'Testpassword1',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({ username: 'testuser' });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.username).toBe('testuser');

    // Assert that the password is encrypted
    const isPasswordValid = await bcrypt.compare('Testpassword1', userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('should not allow empty fields', async () => {
    const response = await request(app).post('/adduser').send({ username: '', password: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("El campo nombre de usuario es obligatorio y no puede estar vacío");
  });

  it('should not allow empty fields', async () => {
    const response = await request(app).post('/adduser').send({ username: 'testuser', password: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("El campo contraseña es obligatorio y no puede estar vacío");
  });

  it('should not allow duplicate usernames', async () => {
    const newUser = { username: 'duplicateUser', password: 'TestPassword1' };

    await request(app).post('/adduser').send(newUser); // Primer registro correcto
    const response = await request(app).post('/adduser').send(newUser); // Segundo intento debe fallar

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El nombre de usuario ya está en uso');
  });

  it('should not allow weak passwords', async () => {
    const weakPasswords = ['abcdef', 'password', '12345678', 'noNumberA'];

    for (const weakPassword of weakPasswords) {
      const response = await request(app).post('/adduser').send({ username: 'weakUser', password: weakPassword });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres.');
    }
  });
});
