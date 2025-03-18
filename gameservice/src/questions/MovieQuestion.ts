import { Question } from "./Question";

export class MovieQuestion extends Question {
    private question = "De qué película es esta imagen?"
    
    constructor(url: string, correctAnswer: string, options: string[]) {
        super(url, correctAnswer, options);
    }

    getQuestion(): String {
        return this.question;
    }
}