import express from "express";
import cors from "cors";

import { GameController } from "./GameController";
import { QuestionManager } from "./QuestionManager";
import { AnswerVerifier } from "./AnswerVerifier";

const questionGen = new QuestionManager();
const answerVer = new AnswerVerifier();
const gameController = new GameController(questionGen, answerVer);

const app = express();
app.use(express.json());
app.use(cors());

// Petición para iniciar el juego
app.post("/start", async (req: any, res: any) => {
  console.log("Juego iniciado");
  await gameController.startGame();
  res.sendStatus(200);
});

// Petición para terminar el juego
app.post("/end", (req: any, res: any) => {
  gameController.endGame();
  res.sendStatus(200);
});

// Petición para obtener la pregunta actual
app.get("/question", (req: any, res: any) => {
  const question = gameController.getCurrentQuestion();
  console.log("Pregunta enviada:", question);
  res.json(question);
});

// Petición para obtener respuesta
app.post("/answer", (req: any, res: any) => {
  const selectedAnswer = req.body.answer;
  const prueba = gameController.submitAnswer(selectedAnswer);
  res.status(200).json(prueba);
});

app.listen(8005, () => {
  console.log("Servidor iniciado en el puerto 8005");
});