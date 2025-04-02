const { Question } = require("../questions/Question");
const { CharacterQuestion } = require("../questions/CharacterQuestion");
const { AbstractQuestionGenerator } = require("./AbstractQuestionGenerator");
const { characterQuery } = require("./Queries");

export class CharacterQuestionGenerator extends AbstractQuestionGenerator {

    constructor() {
        super()
        this.query = characterQuery;
    }

    doGenerateQuestion(correctOption, options, data) {
        return new CharacterQuestion(data[0], correctOption, options, data[1]);
    }
    mapResult(queryResult, mappedRes) {
        queryResult.results.bindings.forEach((entry) => {
            const characterName = entry.characterLabel.value;
            const seriesName = entry.seriesLabel.value;
            const image = entry.pic.value;
            mappedRes.set(seriesName, [image, characterName]);
        });
    }
}

module.exports = { CharacterQuestionGenerator };