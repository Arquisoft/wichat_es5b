import { QuestionGenerator } from "./QuestionGenerator";
import { AnswerGenerator } from "./AnswerGenerator";
import { AnswerVerifier } from "./AnswerVerifier";
import { Question } from "./questions/Question";

class GameController {
    private score: number;
    private questionGenerator: QuestionGenerator;
    private answerGenerator: AnswerGenerator;
    private answerVerifier: AnswerVerifier;
    private currentQuestion: Question | null;
  
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
      } else {
        console.log("Respuesta incorrecta. Puntuación:", this.score);
      }
  
      this.nextQuestion();
    }
  
    getScore(): number {
      return this.score;
    }
  }