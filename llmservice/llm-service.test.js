//set a fake api key
process.env.LLM_API_KEY = 'test-api-key';

const request = require('supertest');
const axios = require('axios');
const app = require('./llm-service'); 




afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('LLM Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.startsWith('https://generativelanguage')) {
      return Promise.resolve({ data: { candidates: [{ content: { parts: [{ text: 'llmanswer' }] } }] } });
    } else if (url.startsWith('https://empathyai')) {
      return Promise.resolve({ data: { choices: [{message: {content: 'llmanswer'}}] } });
    }
  });

  // Test /ask endpoint with gemini
  it('the gemini llm should reply', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'gemini' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /ask endpoint with empathy
  it('the empathy llm should reply', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'empathy' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });


});

//Test to check the requiered fields
describe('validateRequiredFields', () =>{
  it('the field model is not set', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question'});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: model');
  });

  it('the field question is not set', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ model: 'empathy'});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Missing required field: question');
  });

});