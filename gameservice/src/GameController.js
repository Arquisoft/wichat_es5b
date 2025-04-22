const { Question } = require("./questions/Question");

class GameController {
  constructor(questionManager, answerVerifier){
    this.score = 0
    this.questionManager = questionManager
    this.answerVerifier = answerVerifier
    this.currentQuestion = null;
    this.numberOfAnsweredQuestions = 0;
    this.hasGameEnded = false;
    this.numberOfQuestions = 6;
    this.numberOfOptions=4;
    this.POINTS_PER_QUESTION=100;
    this.POINTS_HINTBUTTONS_USED=5;
    this.POINTS_CHATBOT_USED = 20;
   }

    async startGame() {
      this.score = 0;
      console.log("Inicio del juego");
      await this.questionManager.generateQuestions(this.numberOfQuestions, this.numberOfOptions);
      console.log("PReguntas generadas")
      console.log(this.questionManager.questions)
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
        this.numberOfAnsweredQuestions++;
        return this.doSubmitAnswer(selectedAnswer, timeLeft)
    }

    doSubmitAnswer(selectedAnswer, timeLeft){
        throw new Error("sin implementar");
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

    setNumberOfQuestions(n) {
      this.numberOfQuestions = n;
    }

    setNumberOfOptions(n){
        console.log("N Opciones"+n)
        this.numberOfOptions = n;
    }

    getNumberOfQuestions(){
        return this.numberOfQuestions;
    }
  }
  module.exports = { GameController };