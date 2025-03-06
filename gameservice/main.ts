import * as readline from "readline";

import { GameController } from "./GameController";
import { AnswerGenerator } from "./AnswerGenerator";
import { AnswerVerifier } from "./AnswerVerifier";
import { QuestionGenerator } from "./QuestionGenerator";

// Configurar entrada de usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Juego
const questionGen = new QuestionGenerator();
const answerGen = new AnswerGenerator();
const answerVer = new AnswerVerifier();
const game = new GameController(questionGen, answerGen, answerVer);

function askQuestion() {
  if (!game["currentQuestion"]) return;

  console.log(`\nPregunta: ${game["currentQuestion"].imageUrl}`);
  game["currentQuestion"].options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  rl.question("Elige una opción (1-4): ", (answer) => {
    const index = parseInt(answer) - 1;
    const selectedAnswer = game["currentQuestion"]?.options[index];

    if (!selectedAnswer) {
      console.log("Opción inválida. Inténtalo de nuevo.");
      askQuestion();
      return;
    }

    game.submitAnswer(selectedAnswer);
    if (!game.isGameEnded()) {
      askQuestion();
    }
  });
}

// Iniciar el juego
game.startGame();
askQuestion();

