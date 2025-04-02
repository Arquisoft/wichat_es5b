const { Question } = require("./Question");

class ActorQuestion extends Question {
    

    
    constructor(url, correctAnswer, options , characterName , movieName) {
        super(url, correctAnswer, options);
        this.actorName = correctAnswer;
        this.characterName = characterName;
        this.movieName = movieName;
        this.question = `¿Quién interpreta a ${this.characterName} en la película ${this.movieName}?`;

        this.questionsLlm = [
            "Dime el lugar de nacimiento de " + this.actorName +" , no puedes decir ni el nombre ni el apellido del actor (formato: Nació en {lugar}.). Si no tienes información suficiente para dar una respuesta, no digas ni el nombre ni el apellido del actor, sólo di `No hay suficiente información disponible`",
            "Di el año de nacimiento de " + this.actorName +" , no puedes decir ni el nombre ni el apellido del actor (formato: Tiene {edad} años).  Si no tienes información suficiente para dar una respuesta, no digas ni el nombre ni el apellido del actor, sólo di `No hay suficiente información disponible`",
            "Di 1 o 2 papeles conocidos que haya interpretado " + this.actorName + " sin contar" + this.characterName+", si no hay otro papel relevante di que no tiene otros papeles relevantes. No digas ni el nombre ni el apellido del actor (Formato: Otros papeles que ha interpretado son {papeles}). ",
            "Di la inicial del nombre de " + this.actorName + ", no puedes decir ni el nombre ni el apellido del actor (Formato: Su nombre comienza por {letra}).  Si no tienes información suficiente para dar una respuesta, no digas ni el nombre ni el apellido del actor, sólo di `No hay suficiente información disponible`. No digas nada más"
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