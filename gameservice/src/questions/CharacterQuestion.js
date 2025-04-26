const { Question } = require("./Question");

class CharacterQuestion extends Question {
    
    constructor(url, correctAnswer, options, characterName) {
        super(url, correctAnswer, options);
        this.characterName = characterName;
        this.question = {
            es: `¿En qué serie de televisión aparece ${characterName}?`,
            en: `Which TV series does ${characterName} appear in?`
        };
        this.questionsLlm = {
            es: [
                `Responde muy brevemente, no más de una línea. ¿En qué año debutó la serie donde aparece ${characterName}? No digas el nombre de la serie (Formato: La serie debutó en {año}).`,
                `Responde muy brevemente, no más de una línea. ¿Qué actor/actriz interpreta a ${characterName}? No digas el nombre de la serie (Formato: Es interpretado por {nombre del actor}).`,
                `Responde muy brevemente, no más de una línea. ¿Cuál es la profesión o rol principal de ${characterName} en la serie? No digas el nombre de la serie (Formato: Su profesión/rol es {profesión/rol}).`,
                `Responde muy brevemente, no más de una línea. ¿En qué cadena/plataforma se emitió originalmente la serie de ${characterName}? No digas el nombre de la serie (Formato: Se emitió originalmente en {cadena/plataforma}).`
            ],
            en: [
                `Answer very briefly, no more than one line. What year did the series featuring ${characterName} debut? Don't mention the series name (Format: The series debuted in {year}).`,
                `Answer very briefly, no more than one line. Who plays ${characterName}? Don't mention the series name (Format: The character is played by {actor's name}).`,
                `Answer very briefly, no more than one line. What is ${characterName}'s main profession/role in the series? Don't mention the series name (Format: His/Her profession/role is {profession/role}).`,
                `Answer very briefly, no more than one line. On which network/platform was ${characterName}'s series originally released? Don't mention the series name (Format: It was originally released on {network/platform}).`
            ]
        };
    }

    getQuestion() {
        return this.question;
    }
}

module.exports = { CharacterQuestion };