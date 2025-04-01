import { AbstractQuestionGenerator } from "./AbstractQuestionGenerator";
import { Question } from "../questions/Question";
import { ActorQuestion } from "../questions/ActorQuestion";
import { actorQuery } from "./Queries";

export class ActorQuestionGenerator extends AbstractQuestionGenerator {

    constructor(){
        super()
        this.query = actorQuery;
    }

    doGenerateQuestion(correctOption :string, options: string[], data : string[]) : Question{
        return new ActorQuestion(data[0], correctOption, options, data[1], data[2]);
    }

    mapResult(queryResult : any, mappedRes: Map<String, String[]>): any{
        console.log("queryResult: "+queryResult)
        queryResult.results.bindings.forEach((entry: any) => {
            const character = entry.characterLabel.value;
            const performer = entry.performerLabel.value;
            const movieName = entry.filmTitle.value;
            const image = entry.pic.value;
            mappedRes.set(performer, [image, character, movieName]);
        });
    }    
}
