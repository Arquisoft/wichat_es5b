const { Question } = require("./Question");

class CharacterQuestion extends Question {
    
    constructor(url, correctAnswer, options, characterName) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
        this.question = {
            es: `¿En qué serie de televisión aparece ${characterName}?`,
            en: `Which TV series does ${characterName} appear in?`
        };
    }

    getQuestion() {
        return this.question;
    }
}

module.exports = { CharacterQuestion };