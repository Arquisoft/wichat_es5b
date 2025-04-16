const express = require("express");
const cors = require("cors");

const { QuestionManager } = require("./QuestionManager");
const { AnswerVerifier } = require("./AnswerVerifier");
const { ClassicGameController } = require("./gameMode/ClassicGameController");
const { BateriaDeSabiosController } = require("./gameMode/BateriaDeSabiosController");

const answerVer = new AnswerVerifier();
const questionGen = new QuestionManager();
let gameController = new ClassicGameController(questionGen, answerVer);

const app = express();
app.use(express.json());
app.use(cors());

// Petición para iniciar el juego
app.post("/start", async (req  , res  ) => {
  console.log("Juego iniciado", req.body.nQuestions);
  selectController(req.body.gameMode);
  gameController.setNumberOfQuestions(req.body.nQuestions);
  await gameController.startGame();
  res.sendStatus(200);
});

function selectController(gameMode){
  if(gameMode ==="normal"){
    gameController= new ClassicGameController(questionGen, answerVer);
    gameController.setNumberOfOptions(4);
  }
  else if(gameMode === "bateriaSabios"){
    gameController= new BateriaDeSabiosController(questionGen, answerVer);
    gameController.setNumberOfOptions(2);
  }
}

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

// Petición para obtener respuesta    <
app.post("/answer", (req  , res  ) => {
  const selectedAnswer = req.body.answer;
  const timeLeft = req.body.timeLeft;
  const isCorrect = gameController.submitAnswer(selectedAnswer, timeLeft);
  const score = gameController.score
  res.json({ isCorrect, score});
});

// Petición tras utilizar una pista del llm (actualizar puntuación)
app.post("/hintUsed", (req  , res  ) => {
  const numHint = req.body.numHint;
  gameController.hintUsed(numHint);
  const score = gameController.score
  res.json({ score});
});

// Petición tras utilizar una pista del llm (actualizar puntuación)
app.post("/chatBotUsed", (req  , res  ) => {
  gameController.chatBotUsed();
  const score = gameController.score
  res.json({ score});
});

app.listen(8005, () => {
  console.log("Servidor iniciado en el puerto 8005");
});

