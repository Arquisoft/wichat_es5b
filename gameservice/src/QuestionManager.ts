import {Question} from "./questions/Question";
import { QuestionGenerator } from "./QuestionGenerator";
import { MovieQuestionGenerator } from "./generators/MovieQuestionGenerator";

export class QuestionManager {

  private questions: Question[];
  private generator: QuestionGenerator;

  constructor() {
    this.questions = [];
    this.generator = new MovieQuestionGenerator();
  }

  async generateQuestions(nQuestions: number) {
    const queryResult = await this.executeQuery();
    const movies = new Map<string, string>();
    queryResult.results.bindings.forEach((entry: any) => {
        const movieName = entry.itemLabel.value;
        const image = entry.pic.value;
        movies.set(movieName, image);
    });

    let generatedQuestions = this.generator.generateQuestions(movies, nQuestions);
    generatedQuestions.forEach(q => this.questions.push(q));
  }

  /**
   * Devuelve una pregunta aleatoria de la lista de preguntas disponibles.
   * 
   * @returns {Question} Una pregunta aleatoria de la lista.
   * Si la lista de preguntas es vacia, puede devolver un error.
   */
  getNextQuestion(): Question { 
      let index = Math.floor(Math.random() * this.questions.length);
      let question = this.questions[index];
      this.questions.splice(index, 1);
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
  getQuestionList(): Question[] {
    return this.questions;
  }

  async executeQuery() : Promise<any> {
    return (await fetch("http://localhost:8004/query")).json()
  }


}