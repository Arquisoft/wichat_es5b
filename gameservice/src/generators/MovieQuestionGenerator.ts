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
        options = this.shuffleOptions(options);
        return new MovieQuestion(correctImage, correctName, options);
    }

    getUnusedIndex(array : [string, string][], generatedIndex: number[]): number{
        let index = this.getRandomIndex(array);
        let count = 0;
        while(generatedIndex.includes(index) && count < array.length) {
            index = this.getRandomIndex(array);
            count++;
        }
        generatedIndex.push(index);
        return index;
    }

    getRandomIndex(array : [string, string][] ): number{
        return Math.floor(Math.random() * array.length);
    }

    shuffleOptions(options: string[]): string[] {
        const shuffled = options.slice(); // hacemos copia para no modificar el original
      
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          
          // Intercambiar elementos en las posiciones i y j
          const temp = shuffled[i];
          shuffled[i] = shuffled[j];
          shuffled[j] = temp;
        }    
        return shuffled;
      }
}
  