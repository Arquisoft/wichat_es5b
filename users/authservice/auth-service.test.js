const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');

let mongoServer;
let app;

//test user
const user = {
  username: 'testuser',
  password: 'Testpassword1',
};

const wronguser = {
  username: 'wronguser',
  password: 'Wrongpassword1',
};

const wornguser2 = {
  username: '',
  password: '',
};

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./auth-service'); 
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('wrong user shloud not login', async () => {
    const response = await request(app).post('/login').send(wronguser);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });

  it('empty user should not login', async () => {
    const response = await request(app).post('/login').send(wornguser2);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid credentials");
  });
});
