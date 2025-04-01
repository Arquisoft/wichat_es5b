const { Question } = require("./Question");

class ActorQuestion extends Question {
    
    
    
    constructor(url, correctAnswer, options , characterName , movieName) {
        super(url, correctAnswer, options);
        this.actorName = correctAnswer;
        this.characterName = characterName;
        this.movieName = movieName;
        this.question = `¿Quién interpreta a ${this.characterName} en la película ${this.movieName}?`;
    }

    getQuestion() {
        return this.question;
    }
}

module.exports = { ActorQuestion };