const { Question } = require("./Question");

class MovieQuestion extends Question {
    
    
    constructor(url, correctAnswer, options ) {
        super(url, correctAnswer, options);
        this.question = "De qué película es esta imagen?"
    }

    getQuestion() {
        return this.question;
    }
}

module.exports = { MovieQuestion };