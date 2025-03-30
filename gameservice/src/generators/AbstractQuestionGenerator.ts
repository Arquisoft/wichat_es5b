import { QuestionGenerator } from "../QuestionGenerator";
import { Question } from "../questions/Question";
import { shuffle } from "../util/GameUtil";


export abstract class AbstractQuestionGenerator implements QuestionGenerator {

    protected query: string ="";

    getQuery():string{
        return this.query;
    }

    generateQuestions(queryResult: any, nQuestions: number): Question[]{  
        const mappedRes = new Map<string, string[]>();
        this.mapResult(queryResult, mappedRes);

        const array = Array.from(mappedRes);
        
        const questions: Question[] = new Array(nQuestions); 
        const generatedQuestions: number[] = new Array(nQuestions);

        for (let i = 0; i < nQuestions; i++) {
            questions[i] = this.generateQuestion(array, generatedQuestions);
        }

        return questions;
    }
    
    generateQuestion(array : [string, string[]][], generatedQuestions : number[] ) : Question {
        let movieIndex = this.getUnusedIndex(array.length, generatedQuestions);
        let [correctOption, correctData] =  array[movieIndex];

        let options : string[] = [] ;
        options.push(correctOption);

        let optionsIndex: number[] = [];
        optionsIndex.push(movieIndex);

        let randomIndex: number;
        
        for(let i = 0; i< Question.NUMBER_OF_OPTIONS;i++){
            randomIndex = this.getUnusedIndex(array.length, optionsIndex);
            const [incorrectName, incorrectData] = array[randomIndex];
            options.push(incorrectName);
        }
        options = shuffle(options);
        return this.doGenerateQuestion(correctOption, options, correctData);
    }

    getUnusedIndex(max: number, generatedIndex: number[]): number{
        let index = this.getRandomIndex(max);
        let count = 0;
        while(generatedIndex.includes(index) && count < max) {
            index = this.getRandomIndex(max);
            count++;
        }
        generatedIndex.push(index);
        return index;
    }

    getRandomIndex(max: number ): number{
        return Math.floor(Math.random() * max);
    }

    abstract doGenerateQuestion(correctOption :string, options: string[], data : string[]) : Question;

    abstract mapResult(queryResult : any, mappedRes: Map<String, String[]>): any;
}
  