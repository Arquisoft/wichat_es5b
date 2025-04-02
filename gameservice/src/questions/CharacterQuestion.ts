import { Question } from "./Question";

export class CharacterQuestion extends Question {
    private characterName : string;
    private question : string;
    
    constructor(url: string, correctAnswer: string, options: string[], characterName : string) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
        this.question = `En qué serie de televisión aparece ${characterName}?`
    }

    getQuestion(): String {
        return this.question;
    }
}