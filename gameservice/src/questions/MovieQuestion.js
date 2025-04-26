const { Question } = require("./Question");

class MovieQuestion extends Question {
    
    
    constructor(url, correctAnswer, options ) {
        super(url, correctAnswer, options);
        this.question = {
            es: "¿A qué película pertenece esta imagen?",
            en: "Which movie does this image belong to?"
        };
        this.questionsLlm = {
            es: [
                `Responde muy brevemente, no más de una línea. ¿De qué año y género es la película ${correctAnswer}? Dame solamente el año y el género, y evita decir el nombre de la película (formato: Fue estrenada en {año}).`,
                `Responde muy brevemente, no más de una línea. Nombre del actor protagonista de ${correctAnswer}, no digas el nombre de la película (Formato: El actor protagonista es {nombre del actor}).`,
                `Responde muy brevemente, no más de una línea. ¿Quién es el personaje principal de ${correctAnswer}? No digas el nombre de la película, solo el nombre del personaje protagonista (Formato: El personaje principal es {nombre del personaje}).`,
                `Responde muy brevemente, no más de una línea. Dime en qué país se grabó la película ${correctAnswer}, no digas el nombre de la película (Formato: La película se grabó en {país donde se grabó}).`
            ],
            en: [
                `Answer very briefly, no more than one line. What year and genre is the movie ${correctAnswer}? Just give the year and genre, avoid mentioning the movie name (Format: It was released in {year}).`,
                `Answer very briefly, no more than one line. Name the lead actor of ${correctAnswer}, don't mention the movie name (Format: The lead actor is {actor's name}).`,
                `Answer very briefly, no more than one line. Who is the main character in ${correctAnswer}? Don't mention the movie name, only the character's name (Format: The main character is {character name}).`,
                `Answer very briefly, no more than one line. Where was the movie ${correctAnswer} filmed? Don't mention the movie name (Format: The movie was filmed in {country where it was filmed}).`
            ]
        };
    }

    getQuestion() {
        return this.question;
    }

    getQuestionsForLlm(){
        return this.questionsLlm;
    }
}

module.exports = { MovieQuestion };