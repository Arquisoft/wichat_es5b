import { Question } from "./questions/Question";

export interface QuestionGenerator {
    generateQuestions(movies: any, nQuestions: number): Question[];    

    getQuery(): string;
  }


  