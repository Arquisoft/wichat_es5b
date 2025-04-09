const { Question } = require("./Question");

class ActorQuestion extends Question {
    

    
    constructor(url, correctAnswer, options , characterName , movieName) {
        super(url, correctAnswer, options);
        this.actorName = correctAnswer;
        this.characterName = characterName;
        this.movieName = movieName;
        this.question = `¿Quién interpreta a ${this.characterName} en la película ${this.movieName}?`;

        this.questionsLlm = [
            "Responde muy brevemente, no más de una línea. Dime el lugar de nacimiento de " + this.actorName +" (formato: Nació en {lugar}.). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente `No hay suficiente información disponible`. No digas nada más",
            "Responde muy brevemente, no más de una línea. Di el año de nacimiento de " + this.actorName +" (formato: Tiene {edad} años). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente `No hay suficiente información disponible`. No digas nada más",
            "Responde muy brevemente, no más de una línea. Di 1 papel conocido que haya interpretado " + this.actorName + " sin contar" + this.characterName+", si no hay otro papel relevante di que no tiene otros papeles relevantes (Formato: Otro papel que ha hecho es {papel, solo el nombre sin dar explicaciones}). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente `No hay suficiente información disponible`. No digas nada más",
            "Responde muy brevemente, no más de una línea. Di la primera letra de " + this.actorName + ", teniendo únicamente en cuenta la primera palabra que te paso (El formato de la respuesta que quiero que des es: Su nombre comienza por {letra}). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente `No hay suficiente información disponible`. No digas nada más"
          ];
    }

    getQuestion() {
        return this.question;
    }

    getQuestionsForLlm(){
        return this.questionsLlm;
    }
}

module.exports = { ActorQuestion };