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
    console.log('Mocking axios.post:', url, data); // Log the URL and data being sent
    if (url.startsWith('https://generativelanguage')) {
      return Promise.resolve({ data: { candidates: [{ content: { parts: [{ text: 'llmanswer' }] } }] } });
    } else if (url.startsWith('https://empathyai')) {
      return Promise.resolve({ data: { choices: [{message: {content: 'llmanswer'}}] } });
    } 
  });

  
  

  // Test /ask endpoint with empathy
  it('the mistral llm should reply', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'empathy' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /ask endpoint with empathy
  it('the qwen llm should reply', async () => {
    const response = await request(app)
      .post('/ask')
      .send({ question: 'a question', model: 'empathyQwen' });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });
  

});

//Test to check the requiered fields
describe('Validate Required Fields', () =>{
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

  //Test to check the exceptions
  describe('Check exceptions', () => {
    it('the model is not supported', async () => {
      jest.spyOn(console, 'error');

      const response = await request(app)
        .post('/ask')
        .send({question: 'a question', model: 'unknown'});

      expect(response.statusCode).toBe(200);
      expect(console.error).toHaveBeenCalledWith('Error sending question to unknown:', 'Model "unknown" is not supported.');
    });

    it('could only decode wiki URL', async () => {
      jest.spyOn(console, 'warn');

      const response = await request(app)
        .post('/askWithImageViaPrompt')
        .send({question: 'url', imageUrl: 'er%ror.pn'});

      expect(response.statusCode).toBe(200);
      expect(console.warn).toHaveBeenCalledWith('Could not decode/re-encode non-wiki URL:','er%ror.pn','URI malformed');
    });
  });

  
  describe('Test the /askWithImageViaPrompt endpoint', () => {
    it('should return a response', async () => {
      const response = await request(app)
      .post('/askWithImageViaPrompt')
      .send({ question:'question', imageUrl: 'wiki/Special:FilePath/url.png'});

      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.answer).toBe('llmanswer');
    });


  });

  //Test to check the API key if missing
  describe('Validate missing API key', () => {
    it('API key is missing', async () => {
      process.env.LLM_API_KEY="";
      process.env.GEMINI_API_KEY="";

      let response = await request(app)
        .post('/ask')
        .send({question: 'a question', model: 'empathy'});

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('API key is missing.');

      response = await request(app)
        .post('/askWithImageViaPrompt')
        .send({question: 'url', imageUrl: 'wiki/Special:FilePath/url.png'});

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Gemini API key is missing.');
    })
  });

  

    

  

