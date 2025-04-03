const express = require("express");
const cors = require("cors");

const { GameController } = require("../src/GameController");
const { QuestionManager } = require("../src/QuestionManager");
const { AnswerVerifier } = require("../src/AnswerVerifier");

const questionGen = new QuestionManager();
const answerVer = new AnswerVerifier();
const gameController = new GameController(questionGen, answerVer);

const app = express();
app.use(express.json());
app.use(cors());

// Petición para iniciar el juego
app.post("/start", async (req  , res  ) => {
  console.log("Juego iniciado");
  await gameController.startGame();
  res.sendStatus(200);
});

// Petición para terminar el juego
app.post("/end", (req  , res  ) => {
  gameController.endGame();
  res.sendStatus(200);
});

// Petición para obtener la pregunta actual
app.get("/question", (req  , res  ) => {
  const question = gameController.getCurrentQuestion();
  console.log("Pregunta enviada:", question);
  res.json(question);
});

// Petición para obtener respuesta
app.post("/answer", (req  , res  ) => {
  const selectedAnswer = req.body.answer;
  const timeLeft = req.body.timeLeft;
  const prueba = gameController.submitAnswer(selectedAnswer, timeLeft);
  res.json({ score:5});
});

app.listen(8005, () => {
  console.log("Servidor iniciado en el puerto 8005");
});

