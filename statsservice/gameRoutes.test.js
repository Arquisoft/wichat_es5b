/*

Archivo con test para probar la correcta funcionalidad de inserción y recuperación de 
partidas y rankings en la base de datos de la aplicación.

*/

const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../users/userservice/user-service'); // Asegúrate de que la ruta sea correcta
const { Ranking, GameHistory } = require('../gameModels');

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/testdb';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

describe('Game Routes', () => {
  it('should GET all the rankings', async () => {
    const res = await request(server).get('/api/game/ranking');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should POST a new ranking entry', async () => {
    const ranking = {
      username: 'testuser',
      correctAnswers: 4,
      wrongAnswers: 2
    };
    const res = await request(server).post('/api/game/ranking').send(ranking);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('correctAnswers', 4);
    expect(res.body).toHaveProperty('wrongAnswers', 2);
  });

  it('should GET all the game histories', async () => {
    const res = await request(server).get('/api/game/history');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should POST a new game history entry', async () => {
    const history = {
      username: 'testuser',
      date: new Date(),
      correctAnswers:3,
      wrongAnswers: 3
    };
    const res = await request(server).post('/api/game/history').send(history);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('correctAnswers', 3);
    expect(res.body).toHaveProperty('wrongAnswers', 3);
  });
});