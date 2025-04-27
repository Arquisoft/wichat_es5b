/*

Archivo con test para probar la correcta funcionalidad de inserción y recuperación de 
partidas y rankings en la base de datos de la aplicación.

*/

const request = require('supertest');
const mongoose = require('mongoose');
const server = require('./gameRoutes');
const { Ranking, GameHistory } = require('./gameModels');


afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
  server.close();
});

describe('Game Routes', () => {
  it('should GET all the rankings', async () => {
    const res = await request(server).get('/ranking');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should POST a new ranking entry', async () => {
    const ranking = {
      username: 'testuser',
      correctAnswers: 4,
      wrongAnswers: 2,
      totalScore: 10,
      questions: ['question1', 'question2', 'question3', 'question4', 'question5', 'question6']
    };
    const res = await request(server).post('/newRanking').send(ranking);
    expect(res.statusCode).toEqual(201);
  });

  it('should GET all the game histories', async () => {
    const user = {
      username: 'testuser'
    };
    const res = await request(server).post('/history').send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should POST a new game history entry', async () => {
    const history = {
      username: 'testuser',
      date: '2024-01-01T12:34:56Z',
      correctAnswers: 1,
      wrongAnswers: 0,
      totalScore: 10,
      questions: [{question:'question1',correctOption:'option'}]
    };
    const res = await request(server).post('/newHistory').send(history);
    expect(res.statusCode).toEqual(201);
  });
});