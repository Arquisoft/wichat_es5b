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

  //TEST PARA UPDATE USERNAME

  it('should update the username on POST /updateusername', async () => {
    const user = new User({
      username: 'oldUsername',
      password: await bcrypt.hash('ValidPass1', 10)
    });
    await user.save();
  
    const response = await request(app).post('/updateusername').send({
      userId: user._id,
      newUsername: 'newUsername'
    });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuario actualizado correctamente');
  
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.username).toBe('newUsername');
  });
  
  it('should return 404 if user is not found in /updateusername', async () => {
    const response = await request(app).post('/updateusername').send({
      userId: '6612d8e2d508f3c53f0e5aaa', // fake valid ObjectId
      newUsername: 'anyName'
    });
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Usuario no encontrado');
  });
  
  it('should not allow updating to an already used username', async () => {
    const existingUser = new User({
      username: 'existingUser',
      password: await bcrypt.hash('ValidPass1', 10)
    });
    await existingUser.save();
  
    const user = new User({
      username: 'changeMe',
      password: await bcrypt.hash('ValidPass2', 10)
    });
    await user.save();
  
    const response = await request(app).post('/updateusername').send({
      userId: user._id,
      newUsername: 'existingUser'
    });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El nuevo nombre de usuario ya está en uso');
  });

  //TEST PARA UPDATE PASSWORD

  it('should update password successfully on POST /updatepassword', async () => {
    
    const hashedPassword = await bcrypt.hash('OldPassword1', 10);

    const user = new User({
      username: 'passwordUser',
      password: hashedPassword
    });

    await user.save();
  
    const response = await request(app).post('/updatepassword').send({
      userId: user._id,
      oldPassword: 'OldPassword1',
      newPassword: 'NewPassword1',
      confirmPassword: 'NewPassword1'
    });
  
    expect(response.status).toBe(200);

    expect(response.body.message).toBe('Contraseña actualizada correctamente');
  
    const updatedUser = await User.findById(user._id);

    const isMatch = await bcrypt.compare('NewPassword1', updatedUser.password);

    expect(isMatch).toBe(true);
  });
  
  it('should return error if old password is incorrect', async () => {

    const userIncorrectPass = new User({
      username: 'wrongOldPass',
      password: await bcrypt.hash('CorrectOld1', 10)
    });

    await userIncorrectPass.save();
  
    const response = await request(app).post('/updatepassword').send({
      userId: userIncorrectPass._id,
      oldPassword: 'WrongOld1',
      newPassword: 'NewPassword1',
      confirmPassword: 'NewPassword1'
    });
  
    expect(response.status).toBe(400);

    expect(response.body.error).toBe('Contraseña actual incorrecta');
  });
  
  it('should return error if new passwords do not match', async () => {

    const userNewPassDontMatch = new User({
      username: 'notMatching',
      password: await bcrypt.hash('ValidOld1', 10)
    });

    await userNewPassDontMatch.save();
  
    const response = await request(app).post('/updatepassword').send({
      userId: userNewPassDontMatch._id,
      oldPassword: 'ValidOld1',
      newPassword: 'NewPassword1',
      confirmPassword: 'DifferentPassword1'
    });
  
    expect(response.status).toBe(400);

    expect(response.body.error).toBe('Las contraseñas no coinciden');
  });
  
  it('should return error for weak new password', async () => {

    const userWeakPass = new User({
      username: 'weakPass',
      password: await bcrypt.hash('OldPass1', 10)
    });

    await userWeakPass.save();
  
    const response = await request(app).post('/updatepassword').send({
      userId: userWeakPass._id,
      oldPassword: 'OldPass1',
      newPassword: 'abc',
      confirmPassword: 'abc'
    });
  
    expect(response.status).toBe(400);

    expect(response.body.error).toBe('La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres.');
  });
  
});
