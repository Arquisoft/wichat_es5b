import { Question } from "../questions/Question";
import { CharacterQuestion } from "../questions/CharacterQuestion";
import { AbstractQuestionGenerator } from "./AbstractQuestionGenerator";
import { characterQuery } from "./Queries";

export class CharacterQuestionGenerator extends AbstractQuestionGenerator {

    constructor() {
        super()
        this.query = characterQuery;
    }

    doGenerateQuestion(correctOption: string, options: string[], data: string[]): Question {
        return new CharacterQuestion(data[0], correctOption, options, data[1]);
    }
    mapResult(queryResult: any, mappedRes: Map<String, String[]>) {
        queryResult.results.bindings.forEach((entry: any) => {
            const characterName = entry.characterLabel.value;
            const seriesName = entry.seriesLabel.value;
            const image = entry.pic.value;
            mappedRes.set(seriesName, [image, characterName]);
        });
    }
}
  