import { AbstractQuestionGenerator } from "./AbstractQuestionGenerator";
import { Question } from "../questions/Question";
import { MovieQuestion } from "../questions/MovieQuestion";


export class MovieQuestionGenerator extends AbstractQuestionGenerator {
    
   constructor(){
        super()
        this.query = `
        SELECT DISTINCT ?itemLabel (SAMPLE(?pic) AS ?pic) WHERE {
        ?item wdt:P31 wd:Q11424;
        wdt:P577 ?publication_date;
        wdt:P18 ?pic.
        
        FILTER (?publication_date >= "2025-00-00T00:00:00Z"^^xsd:dateTime)

        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        
        }

        GROUP BY ?item ?itemLabel

        `;
    }

    doGenerateQuestion(correctOption :string, options: string[], data : string[]) : Question{
        return new MovieQuestion(data[0], correctOption, options);
    }

    mapResult(queryResult : any, mappedRes: Map<String, String[]>): any{
        queryResult.results.bindings.forEach((entry: any) => {
            const movieName = entry.itemLabel.value;
            const image = entry.pic.value;
            mappedRes.set(movieName, [image]);
        });
    }
}
  