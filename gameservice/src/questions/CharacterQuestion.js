const { Question } = require("./Question");

class CharacterQuestion extends Question {
    
    constructor(url, correctAnswer, options, characterName) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
        this.question = `En qué serie de televisión aparece ${characterName}?`
    }

    getQuestion() {
        return this.question;
    }
}

module.exports = { CharacterQuestion };