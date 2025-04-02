const { Question } = require("./Question");

export class CharacterQuestion extends Question {
    
    constructor(url, correctAnswer, options, characterName) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
        this.question = `En qué serie de televisión aparece ${characterName}?`
    }

    getQuestion() {
        return this.question;
    }
}