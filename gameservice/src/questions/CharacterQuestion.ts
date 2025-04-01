import { Question } from "./Question";

export class CharacterQuestion extends Question {
    private question = "En qué serie aparece este personaje?"
    
    constructor(url: string, correctAnswer: string, options: string[] ) {
        super(url, correctAnswer, options);
    }

    getQuestion(): String {
        return this.question;
    }
}