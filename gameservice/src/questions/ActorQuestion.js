const { Question } = require("./Question");

class ActorQuestion extends Question {
    

    
    constructor(url, correctAnswer, options , characterName , movieName) {
        super(url, correctAnswer, options);
        this.actorName = correctAnswer;
        this.characterName = characterName;
        this.movieName = movieName;
        this.question = {
            es: `¿Quién interpreta a ${characterName} en la película ${movieName}?`,
            en: `Who plays ${characterName} in the movie ${movieName}?`
        };

        this.questionsLlm = {
            es: [
                `Responde muy brevemente, no más de una línea. Dime el lugar de nacimiento de ${this.actorName} (formato: Nació en {lugar}.). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente 'No hay suficiente información disponible'. No digas nada más`,
                `Responde muy brevemente, no más de una línea. Di el año de nacimiento de ${this.actorName} (formato: Tiene {edad} años). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente 'No hay suficiente información disponible'. No digas nada más`,
                `Responde muy brevemente, no más de una línea. Di 1 papel conocido que haya interpretado ${this.actorName} sin contar ${this.characterName}, si no hay otro papel relevante di que no tiene otros papeles relevantes (Formato: Otro papel que ha hecho es {papel, solo el nombre sin dar explicaciones}). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente 'No hay suficiente información disponible'. No digas nada más`,
                `Responde muy brevemente, no más de una línea. Di la primera letra de ${this.actorName}, teniendo únicamente en cuenta la primera palabra que te paso (El formato de la respuesta que quiero que des es: Su nombre comienza por {letra}). No puedes incluir ni el nombre, ni el apellido, ni el nombre y apellido que te paso del actor en tu respuesta. Si no tienes información suficiente para dar una respuesta, sólo di literalmente 'No hay suficiente información disponible'. No digas nada más`
            ],
            en: [
                `Answer very briefly, no more than one line. Tell me the birthplace of ${this.actorName} (format: Born in {place}). You cannot include the first name, last name, or both of the actor's name in your response. If you do not have enough information to give an answer, just say literally 'No sufficient information available'. Do not say anything else.`,
                `Answer very briefly, no more than one line. Tell me the birth year of ${this.actorName} (format: He/She is {age} years old). You cannot include the first name, last name, or both of the actor's name in your response. If you do not have enough information to give an answer, just say literally 'No sufficient information available'. Do not say anything else.`,
                `Answer very briefly, no more than one line. Name one known role played by ${this.actorName} excluding ${this.characterName}, if no other relevant roles are known say that they have no other relevant roles (Format: Another role he/she has done is {role name, only the name without explanation}). You cannot include the first name, last name, or both of the actor's name in your response. If you do not have enough information to give an answer, just say literally 'No sufficient information available'. Do not say anything else.`,
                `Answer very briefly, no more than one line. Tell me the first letter of ${this.actorName}, considering only the first word I gave you (The format of the answer I want is: His/Her name starts with {letter}). You cannot include the first name, last name, or both of the actor's name in your response. If you do not have enough information to give an answer, just say literally 'No sufficient information available'. Do not say anything else.`
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

module.exports = { ActorQuestion };