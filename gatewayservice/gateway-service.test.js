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
    } else if (url.endsWith('/updateusername')) {
      return Promise.resolve({ data: { message: 'updated' } });
    } else if (url.endsWith('/updatepassword')) {
      return Promise.resolve({ data: { message: 'updated' } });
    } else if (url.endsWith('/getUserRole')) {
      return Promise.resolve({ data: { role: 'Admin' } });
    } else if (url.endsWith('/hintUsed') || url.endsWith('/chatBotUsed')) {
      return Promise.resolve({ data: { score: 10 } });
    } else if (url.endsWith('/askWithImageViaPrompt')) {
      return Promise.resolve({ data: { answer: 'answer' } });
    }
  
     
  });

  axios.get.mockImplementation((url, data) => {
    if (url.endsWith('/ranking')) {
      return Promise.resolve({ data: { ranking: 'rank' } });
    } else if (url.endsWith('/question')) {
      return Promise.resolve({ data: { question: 'question' } });
    } else if (url.endsWith('/health')) {
      return Promise.resolve({ data: { status: 'OK' } });
  }});


  // Test /health endpoint
  it('should ask for the health of gateway', async () => {
    const response = await request(app)
      .get('/health')

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test /updateusername endpoint
  it('should try to update the username', async () => {
    const response = await request(app)
      .post('/updateusername')
      .send({ userId: '432r234', newUsername: 'user' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('updated');
  });

  // Test /updatepassword endpoint
  it('should try to update the password', async () => {
    const response = await request(app)
      .post('/updatepassword')
      .send({ userid:'userId', oldPassword:'oldPassword', newPassword:'newPassword', confirmPassword:'confirmPassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('updated');
  });

  // Test /hintUsed
  it('should try to change the score because of a hint', async () => {
    const response = await request(app)
      .post('/hintUsed')

    expect(response.statusCode).toBe(200);
    expect(response.body.score).toBe(10);
  });

  // Test /chatBotUsed
  it('should try to change the score because of the chat', async () => {
    const response = await request(app)
      .post('/chatBotUsed')

    expect(response.statusCode).toBe(200);
    expect(response.body.score).toBe(10);
  });

  // Test /askWithImage
  it('should try to ask with image', async () => {
    const response = await request(app)
      .post('/askWithImage')
      .send({ imageUrl: 'url' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('answer');
  });
    

  // Test /getUserRole endpoint
  it('should try to get the role of a user', async () => {
    const response = await request(app)
      .post('/getUserRole')
      .send({ userId: '432r234' });

    expect(response.statusCode).toBe(200);
    expect(response.body.role).toBe('Admin');
  });

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

  // Test /newRanking endpoint
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