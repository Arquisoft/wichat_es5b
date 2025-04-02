const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url.endsWith('/ask')) {
      return Promise.resolve({ data: { answer: 'llmanswer' } });
    } else if (url.endsWith('/query')) {
      return Promise.resolve({ data: { question: 'question' } });
    } else if (url.endsWith('/history')) {
      return Promise.resolve({ data: { history: 'history' } });
    } else if (url.endsWith('/newRanking')) {
      return Promise.resolve({ data: { ranking: 'rank' } });
    } else if (url.endsWith('/newHistory')) {
      return Promise.resolve({ data: { history: 'history' } });
    } else if (url.endsWith('/start')) {
      return Promise.resolve({ data: { start: 'start' } });
    } else if (url.endsWith('/end')) {
      return Promise.resolve({ data: { end: 'end' } });
    
    } else if (url.endsWith('/answer')) {
      return Promise.resolve({ data: { answer: 'answer' } });
    } 
     
  });

  axios.get.mockImplementation((url, data) => {
    if (url.endsWith('/ranking')) {
      return Promise.resolve({ data: { ranking: 'rank' } });
    } else if (url.endsWith('/question')) {
      return Promise.resolve({ data: { question: 'question' } });
  }});

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  // Test /askllm endpoint
  it('should forward askllm request to the llm service', async () => {
    const response = await request(app)
      .post('/askllm')
      .send({ question: 'question', apiKey: 'apiKey', model: 'gemini' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /query endpoint
  it('should ask to the wikidata service', async () => {
    const response = await request(app)
      .post('/queryWikiData')

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('question');
  });

  // Test /history endpoint
  it('should ask the history', async () => {
    const response = await request(app)
      .post('/history')
      .send({username:'username'})

    expect(response.statusCode).toBe(200);
    expect(response.body.history).toBe('history');
  });

  // Test /ranking endpoint
  it('should ask the ranking', async () => {
    const response = await request(app)
      .get('/ranking')

    expect(response.statusCode).toBe(200);
    expect(response.body.ranking).toBe('rank');
  });

  // Test /newHistory endpoint
  it('should add the newHistory', async () => {
    const response = await request(app)
      .post('/newHistory')
      .send({username: "user", date:"date", correct:2, wrong:4})

    expect(response.statusCode).toBe(200);
    expect(response.body.history).toBe('history');
  });

  // Test /newHistory endpoint
  it('should add the newRanking', async () => {
    const response = await request(app)
      .post('/newRanking')
      .send({username: "user", correct:2, wrong:4})

    expect(response.statusCode).toBe(200);
    expect(response.body.ranking).toBe('rank');
  });

  // Test /end endpoint
  it('should end the game', async () => {
    const response = await request(app)
      .post('/end')

    expect(response.statusCode).toBe(200);
    expect(response.body.end).toBe('end');
  });

  // Test /start endpoint
  it('should start the game', async () => {
    const response = await request(app)
      .post('/start')

    expect(response.statusCode).toBe(200);
    expect(response.body.start).toBe('start');
  });

  // Test /question endpoint
  it('should get the question', async () => {
    const response = await request(app)
      .get('/question')

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('question');
  });

  // Test /answer endpoint
  it('should answer the question', async () => {
    const response = await request(app)
      .post('/answer')
      .send({answer: "Option 1"})

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('answer');
  });

});