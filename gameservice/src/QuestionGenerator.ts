import {Question} from "./questions/Question";
import {MovieQuestion} from "./questions/MovieQuestion";

export class QuestionGenerator {

  private questions: Question[];

  constructor() {
    this.questions = [];
  }

  generateQuestions() {
    // TODO: Generar las preguntas según lo que llegue de Wikidata
  }

  /**
   * Devuelve una pregunta aleatoria de la lista de preguntas disponibles.
   * 
   * @returns {Question} Una pregunta aleatoria de la lista.
   * Si la lista de preguntas es vacia, puede devolver un error.
   */

  getNextQuestion(): Question {
    if (this.questions.length == 0) this.generateQuestions();
    return this.questions[Math.random() * this.questions.length];
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