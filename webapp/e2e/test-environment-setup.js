process.env.LLM_API_KEY = "sk-tpRSusY7sIQFub3jiBONVw";
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoserver;
let userservice;
let authservice;
let llmservice;
let database;
let gameservice;
let wikidataservice;
let gatewayservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    llmservice = await require("../../llmservice/llm-service");
    database = await require("../../statsservice/gameRoutes");
    gameservice = await require("../../gameservice/src/Game");
    wikidataservice = await require("../../wikidataservice/wikidata-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
}

startServer();
