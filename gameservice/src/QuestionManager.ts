import {Question} from "./questions/Question";
import { QuestionGenerator } from "./QuestionGenerator";
import { MovieQuestionGenerator } from "./generators/MovieQuestionGenerator";


export class QuestionManager {

  private wikidataUri = process.env.WIKIDATA_SERVICE_URI || 'http://localhost:8004';


  private questions: Question[];
  private generator: QuestionGenerator[];
  private currentQuestion: number =0;

  constructor() {
    this.questions = [];
    this.generator = [new MovieQuestionGenerator()];
  }

  async generateQuestions(nQuestions: number) {
    for(let i= 0; i< this.generator.length;i++){
      const queryResult = await this.executeQuery(this.generator[i].getQuery());
      let generatedQuestions = this.generator[i].generateQuestions(queryResult, nQuestions);
      generatedQuestions.forEach(q => this.questions.push(q));

    }

   
    this.currentQuestion = 0;
  }

  /**
   * Devuelve una pregunta aleatoria de la lista de preguntas disponibles.
   * 
   * @returns {Question} Una pregunta aleatoria de la lista.
   * Si la lista de preguntas es vacia, puede devolver un error.
   */
  getNextQuestion(): Question { 
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
  getQuestionList(): Question[] {
    return this.questions;
  }

  pushQuestion(question: Question): void {
    this.questions.push(question);
  }

  async executeQuery(query: string) : Promise<any> {
    return (await fetch(`${this.wikidataUri}/query`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })).json();
  }

}