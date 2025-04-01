import { Question } from "./Question";

export class CharacterQuestion extends Question {
    private characterName : string;
    private question = "En qué serie de televisión aparece este personaje?"
    
    constructor(url: string, correctAnswer: string, options: string[], characterName : string) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
    }

    getQuestion(): String {
        return this.question;
    }
}