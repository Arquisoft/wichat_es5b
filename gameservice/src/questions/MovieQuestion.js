const { Question } = require("./Question");

class MovieQuestion extends Question {
    
    
    constructor(url, correctAnswer, options ) {
        super(url, correctAnswer, options);
        this.question = "¿A qué película pertenece esta imagen?"
        this.questionsLlm = [
            "De que año y genero es la pelicula " + this.correctAnswer +" , dame solamente el año y el genero y evita decir el nombre de la pelicula (formato: Fue estrenada en {año})",
            "Nombre del actor protagonista de " + this.correctAnswer + ", no digas el nombre de la pelicula (Formato: El actor protagonista es {nombre del actor}.)",
            "Quien es el personaje principal de " + this.correctAnswer + ", no digas el nombre de la pelicula, solo el nombre del personaje protagonista (Formato: El personaje principal es {nombre del personaje}).",
            "Dame un resumen muy breve en una línea de la trama de la película " + this.correctAnswer + ", no digas el nombre de la película (Formato: La pelicula trata sobre {resumen en una linea})."
        ];
    }

    getQuestion() {
        return this.question;
    }

    getQuestionsForLlm(){
        return this.questionsLlm;
    }
}

module.exports = { MovieQuestion };