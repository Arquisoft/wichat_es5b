import { Question } from "./questions/Question";

export interface QuestionGenerator {
    generateQuestions(movies: Map<string, string>, nQuestions: number): Question[];    
  }
  