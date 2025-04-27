const { shuffle } = require("../src/util/GameUtil");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { MovieQuestionGenerator } = require("../src/generators/MovieQuestionGenerator");
const { ActorQuestionGenerator } = require("../src/generators/ActorQuestionGenerator");
const { CharacterQuestionGenerator } = require("../src/generators/CharacterQuestionGenerator");
const {getRandomValues} = require("node:crypto");


class QuestionManager {

  wikidataUri = process.env.WIKIDATA_SERVICE_URI || 'http://localhost:8004';

  constructor() {
    this.questions = [];
    this.generator = [new MovieQuestionGenerator(), new ActorQuestionGenerator(), new CharacterQuestionGenerator()];
    this.currentQuestion=0;
  }

  setGenerators(generators) {
    this.generator = generators;
  }

  async generateQuestions(nQuestions, nOptions,lang) {
    let nQuestType = Math.floor(nQuestions / this.generator.length);
    let nExtraQuestions = nQuestions % this.generator.length;
    this.questions = [];
    console.log("OPCIONES " + nOptions);

    let queryPromises = this.generator.map((gen, index) => {
      let nQuestionsToGenerate = nQuestType + (index === 0 ? nExtraQuestions : 0);
      const queryI18n = gen.getQuery().replace('{{LANG}}', lang === "es" ? "es,en" : "en")
      return this.executeQuery(queryI18n).then(queryResult =>
          gen.generateQuestions(queryResult, nQuestionsToGenerate, nOptions)
      );
    });

    let results = await Promise.all(queryPromises);

    results.forEach(generatedQuestions => {
      this.questions.push(...generatedQuestions);
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