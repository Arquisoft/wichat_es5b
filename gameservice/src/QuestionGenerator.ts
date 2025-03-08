import {Question} from "./questions/Question";

export class QuestionGenerator {

  private questions: Question[];

  constructor() {
    this.questions = [];
  }

  generateQuestions() {
    // TODO: Generar las preguntas según lo que llegue de Wikidata
    this.questions.push(new Question("", "Interstellar"));
  }

  /**
   * Devuelve una pregunta aleatoria de la lista de preguntas disponibles.
   * 
   * @returns {Question} Una pregunta aleatoria de la lista.
   * Si la lista de preguntas es vacia, puede devolver un error.
   */
  getNextQuestion(): Question {
    if (this.questions.length == 0) this.generateQuestions();
    let index = Math.random() * this.questions.length;
    let question = this.questions[index];
    this.questions.splice(index, 1);
    return question;
  }

  /**
   * Devuelve la lista de preguntas disponibles.
   * 
   * @returns {Question[]} Un array de preguntas.
   */
  getQuestionList(): Question[] {
    return this.questions;
  }

}