import { QuestionGenerator } from "./QuestionGenerator";
import { AnswerGenerator } from "./AnswerGenerator";
import { AnswerVerifier } from "./AnswerVerifier";
import { Question } from "./questions/Question";

export class GameController {
    private score: number;
    private questionGenerator: QuestionGenerator;
    private answerGenerator: AnswerGenerator;
    private answerVerifier: AnswerVerifier;
    private currentQuestion: Question | null;

    private hasGameEnded: boolean = false;
  
    constructor(
      questionGenerator: QuestionGenerator,
      answerGenerator: AnswerGenerator,
      answerVerifier: AnswerVerifier
    ) {
      this.score = 0;
      this.questionGenerator = questionGenerator;
      this.answerGenerator = answerGenerator;
      this.answerVerifier = answerVerifier;
      this.currentQuestion = null;
    }
  
    startGame(): void {
      this.score = 0;
      console.log("Inicio del juego");
      this.nextQuestion();
    }

    endGame(): void {
      console.log("Fin del juego. Puntuación:", this.score);
      this.hasGameEnded = true;
    }
  
    nextQuestion(): void {
      this.currentQuestion = this.questionGenerator.generateQuestion();
      if (this.currentQuestion) {
        this.currentQuestion.options = this.answerGenerator.generateAnswers(
          this.currentQuestion.correctAnswer
        );
        console.log("Nueva pregunta:", this.currentQuestion);
      }
    }
  
    submitAnswer(selectedAnswer: string): void {
      if (!this.currentQuestion) {
        console.log("No hay una pregunta activa.");
        return;
      }
  
      const isCorrect = this.answerVerifier.verifyAnswer(
        selectedAnswer,
        this.currentQuestion.correctAnswer
      );
  
      if (isCorrect) {
        this.score++;
        console.log("¡Respuesta correcta! Puntuación:", this.score);
        this.nextQuestion();
      } else {
        console.log("Respuesta incorrecta.");
        this.endGame();
      }
  
    }
  
    getScore(): number {
      return this.score;
    }

    isGameEnded(): boolean {
      return this.hasGameEnded;
    }
  }