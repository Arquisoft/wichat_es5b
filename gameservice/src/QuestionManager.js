const { GameController } = require("../src/GameController");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { MovieQuestionGenerator } = require("../src/generators/MovieQuestionGenerator");
const { ActorQuestionGenerator } = require("../src/generators/ActorQuestionGenerator");


class QuestionManager {

  wikidataUri = process.env.WIKIDATA_SERVICE_URI || 'http://localhost:8004';

  constructor() {
    this.questions = [];
    this.generator = [new MovieQuestionGenerator(), new ActorQuestionGenerator()];
    this.currentQuestion=0;
  }

  async generateQuestions(nQuestions) {
    let nQuestType = Math.floor(nQuestions/this.generator.length);
    let nExtraQuestions = nQuestions % this.generator.length;

    let queryPromises = this.generator.map((gen, index) => {
      let nQuestionsToGenerate = nQuestType + (index === 0 ? nExtraQuestions : 0);
      return this.executeQuery(gen.getQuery()).then(queryResult =>
          gen.generateQuestions(queryResult, nQuestionsToGenerate)
      );
    });

    let results = await Promise.all(queryPromises);
    results.forEach(generatedQuestions => {
        generatedQuestions.forEach(q => this.questions.push(q));
    });

    this.questions = shuffle(this.questions);

    this.currentQuestion = 0;
  }

  /**
   * Devuelve una pregunta aleatoria de la lista de preguntas disponibles.
   * 
   * @returns {Question} Una pregunta aleatoria de la lista.
   * Si la lista de preguntas es vacia, puede devolver un error.
   */
  getNextQuestion() { 
      let question = this.questions[this.currentQuestion];
      this.currentQuestion++;
      return question;
  }

  /*
  */
  areThereQuestionsLeft() {
    return this.questions.length !=0;
  }

  /**
   * Devuelve la lista de preguntas disponibles.
   * 
   * @returns {Question[]} Un array de preguntas.
   */
  getQuestionList() {
    return this.questions;
  }

  pushQuestion(question) {
    this.questions.push(question);
  }

  async executeQuery(query)  {
    console.log("En el executeQuery")
    return (await fetch(`${this.wikidataUri}/query`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })).json();
  }
}

module.exports = { QuestionManager };