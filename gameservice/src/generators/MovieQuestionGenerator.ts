import { AbstractQuestionGenerator } from "./AbstractQuestionGenerator";
import { Question } from "../questions/Question";
import { MovieQuestion } from "../questions/MovieQuestion";
import { movieQuery } from "./Queries";

export class MovieQuestionGenerator extends AbstractQuestionGenerator {
    
   constructor(){
        super()
        this.query = movieQuery;
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
  