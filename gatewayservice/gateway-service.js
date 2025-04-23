const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8000;

const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8003';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const wikiDataServiceUrl = process.env.WIKIDATA_SERVICE_URL || 'http://localhost:8004';
const databaseUrl = process.env.STATS_URI || 'http://localhost:8006'
const gameUrl = process.env.GAMECONTROLLER_URI || 'http://localhost:8005';


app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/updateusername', async (req, res) => {
  try {
    // Forward the update username request to the user service
    const userResponse = await axios.post(userServiceUrl+'/updateusername', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/updatepassword', async (req, res) => {
  try {
    // Forward the update password request to the user service
    const userResponse = await axios.post(userServiceUrl+'/updatepassword', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/askllm', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const llmResponse = await axios.post(llmServiceUrl+'/ask', req.body);
    res.json(llmResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/askWithImage', async (req, res) => {
  try {
    // Forward the request to the LLM service
    const llmResponse = await axios.post(llmServiceUrl+'/askWithImageViaPrompt', req.body); //askWithImageViaPrompt  /askWithImage
    res.json(llmResponse.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Error processing image' 
    });
  }
});


app.post('/queryWikiData', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const wikiDataResponse = await axios.post(wikiDataServiceUrl+'/query', req.body);
    res.json(wikiDataResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/history", async (req, res) => {
  try {
    const history = await axios.post(databaseUrl+'/history',req.body);
    res.json(history.data);
  } catch(error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get("/ranking", async (req, res) => {
  try {
    const ranking = await axios.get(databaseUrl+'/ranking');
    res.json(ranking.data);
  } catch(error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/newRanking", async (req, res)=>{
  try{
    const rankingResponse = await axios.post(databaseUrl+'/newRanking', req.body);
    res.json(rankingResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/newHistory", async (req, res)=>{
  try{
    const historyResponse = await axios.post(databaseUrl+'/newHistory', req.body);
    res.json(historyResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/start", async (req, res)=>{
  try {
    const startResponse = await axios.post(gameUrl+'/start', req.body);
    res.json(startResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/end", async (req, res)=>{
  try {
    const endResponse = await axios.post(gameUrl+'/end', req.body);
    res.json(endResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get("/question", async (req, res) => {
  try {
    const questionResponse = await axios.get(gameUrl+'/question');
    res.json(questionResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/answer", async (req, res) => {
  try {
    const answerResponse = await axios.post(gameUrl+'/answer', req.body);
    res.json(answerResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/hintUsed", async (req, res) => {
  try {
    const hintUsedResponse = await axios.post(gameUrl+'/hintUsed', req.body);
    res.json(hintUsedResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post("/chatBotUsed", async (req, res) => {
  try {
    const chatBotUsedResponse = await axios.post(gameUrl+'/chatBotUsed', req.body);
    res.json(chatBotUsedResponse.data)
  } catch (error){
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Read the OpenAPI YAML file synchronously
openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
