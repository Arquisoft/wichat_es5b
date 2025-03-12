import { Question } from "./Question";

export class MovieQuestion extends Question {
    private question = "De qué película es esta imagen?"
    
    constructor(url: string, correctAnswer: string) {
        super(url, correctAnswer, []);
    }

    getQuestion(): String {
        return this.question;
    }
}