import { AbstractQuestionGenerator } from "./AbstractQuestionGenerator";
import { Question } from "../questions/Question";
import { ActorQuestion } from "../questions/ActorQuestion";


export class ActorQuestionGenerator extends AbstractQuestionGenerator {

    constructor(){
        super()
        this.query = `
            SELECT DISTINCT ?characterLabel ?performerLabel ?filmTitle (SAMPLE(?pic) AS ?pic) WHERE {
            ?character wdt:P31 wd:Q15773347;
            wdt:P175 ?performer;
            wdt:P1441 ?work;
            wdt:P18 ?pic.
    
            ?work wdt:P31 wd:Q11424;
            wdt:P1476 ?filmTitle;

            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            GROUP BY ?characterLabel ?performerLabel ?filmTitle
        `;
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
