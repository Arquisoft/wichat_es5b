import { QuestionGenerator } from "../QuestionGenerator";
import { Question } from "../questions/Question";
import { MovieQuestion } from "../questions/MovieQuestion";

export class MovieQuestionGenerator implements QuestionGenerator {

    generateQuestions(movies: Map<string, string>, nQuestions: number): Question[]{  
        const moviesArray = Array.from(movies);
        
        const questions: Question[] = new Array(nQuestions); 
        const generatedQuestions: number[] = new Array(nQuestions);

        for (let i = 0; i < nQuestions; i++) {
            questions[i] = this.generateQuestionMovie(moviesArray, generatedQuestions);
        }

        return questions;
    }
    
    generateQuestionMovie(moviesArray : [string, string][], generatedQuestions : number[] ) : MovieQuestion {
        let movieIndex = this.getUnusedIndex(moviesArray, generatedQuestions);
        let [correctName, correctImage] =  moviesArray[movieIndex];

        let options = [];
        options.push(correctName);

        let optionsIndex: number[] = [];
        optionsIndex.push(movieIndex);

        let randomIndex: number;
        
        for(let i = 0; i< Question.NUMBER_OF_OPTIONS;i++){
            randomIndex = this.getUnusedIndex(moviesArray, optionsIndex);
            const [incorrectName, incorrectImage] = moviesArray[randomIndex];
            options.push(incorrectName);
        }
        return new MovieQuestion(correctImage, correctName, options);
    }

    getUnusedIndex(array : [string, string][], generatedIndex: number[]): number{
        let index = this.getRandomIndex(array);    
        while(generatedIndex.includes(index)) {
            index = this.getRandomIndex(array);
        }
        generatedIndex.push(index);
        return index;
    }

    getRandomIndex(array : [string, string][] ): number{
        return Math.floor(Math.random() * array.length);
    }
}
  