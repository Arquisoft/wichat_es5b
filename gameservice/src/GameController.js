const { Question } = require("../src/questions/Question");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { MovieQuestion } = require("../src/questions/MovieQuestion");

class GameController {
  constructor(questionManager, answerVerifier){
    this.score = 0,
    this.questionManager = questionManager,
    this.answerVerifier = answerVerifier,
    this.currentQuestion = null
    this.hasGameEnded = false;
    this.NUMBER_OF_QUESTIONS = 6;
    this.POINTS_PER_QUESTION=100;
    this.POINTS_HINTBUTTONS_USED=5;
    this.POINTS_CHATBOT_USED = 20;
   }

  
    async startGame() {
      this.score = 0;
      console.log("Inicio del juego");
      await this.questionManager.generateQuestions(this.NUMBER_OF_QUESTIONS);
      this.nextQuestion();
    }

    async endGame() {
      console.log("Fin del juego. Puntuación:", this.score);
      this.hasGameEnded = true;
    }
  
    /**
     * Obtiene la siguiente pregunta y la prepara para su uso
     * (establece las opciones de respuesta y la registra como la pregunta actual)
     * 
     * @returns {void} 
     */
    async nextQuestion() {
      this.currentQuestion = this.questionManager.getNextQuestion();
      
      console.log("Nueva pregunta:", this.currentQuestion);
    }

    /**
     * Establece una pregunta personalizada con la URL y respuesta correcta proporcionadas.
     * 
     * FUNCION PARA TESTING
     * PARA OBTENER LA SIGUIENTE PREGUNTA USAR nextQuestion()
     * 
     * @param {string} URL - La URL de la imagen de la pregunta
     * @param {string} correctAnswer - La respuesta correcta para la pregunta
     * @returns {void} 
     */
    setQuestion(URL, options, correctAnswer) {
      this.currentQuestion = new Question(URL, correctAnswer, []);
      this.currentQuestion.setOptions(options);
    }
  
    submitAnswer(selectedAnswer, timeLeft) {
      if (!this.currentQuestion) {
        console.log("No hay una pregunta activa.");
        return false;
      }
      const isCorrect = this.answerVerifier.verifyAnswer(
        selectedAnswer,
        this.currentQuestion.getCorrectAnswer()
      );
      
      if (isCorrect) {
        this.score+=this.POINTS_PER_QUESTION+timeLeft;
      }
      console.log(isCorrect);
      this.nextQuestion();
      return isCorrect;
    }

    timeOver(){
      this.score--;
      console.log("time over");
      this.nextQuestion();
    }
  
    getScore() {
      return this.score;
    }

    isGameEnded() {
      return this.hasGameEnded;
    }

    getCurrentQuestion() {
      if (!this.currentQuestion) {
        console.log("No hay pregunta activa");
      }
      return this.currentQuestion;
    }

    getQuestionManager() {
      return this.questionManager;
    }

    hintUsed(numHint){
        this.score -= (this.POINTS_HINTBUTTONS_USED * (numHint+1))
    }

    chatBotUsed(){
        this.score -=this.POINTS_CHATBOT_USED;
    }

    setDifficulty(dif) {
      switch (dif) {
        case 'easy':
          this.NUMBER_OF_QUESTIONS = 6;
          break;
        case 'medium':
          this.NUMBER_OF_QUESTIONS = 12;
          break;
        case 'hard':
          this.NUMBER_OF_QUESTIONS = 18;
          break;
        default:
      }
      console.log("Preguntas: " + this.NUMBER_OF_QUESTIONS);
    }

    getNumberOfQuestions(){
        return this.NUMBER_OF_QUESTIONS;
    }
  }
  module.exports = { GameController };