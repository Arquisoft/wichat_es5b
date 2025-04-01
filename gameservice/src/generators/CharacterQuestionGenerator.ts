import { QuestionGenerator } from "../QuestionGenerator";
import { Question } from "../questions/Question";
import { MovieQuestion } from "../questions/MovieQuestion";
import { CharacterQuestion } from "../questions/CharacterQuestion";

export class CharacterQuestionGenerator implements QuestionGenerator {

    generateQuestions(series: Map<string, string>, nQuestions: number): Question[]{  
        const seriesArray = Array.from(series);
        
        const questions: Question[] = new Array(nQuestions); 
        const generatedQuestions: number[] = new Array(nQuestions);

        for (let i = 0; i < nQuestions; i++) {
            questions[i] = this.generateQuestionCharacter(seriesArray, generatedQuestions);
        }

        return questions;
    }
    
    generateQuestionCharacter(charactersArray : [string, string][], generatedQuestions : number[] ) : CharacterQuestion {
        let seriesIndex = this.getUnusedIndex(charactersArray, generatedQuestions);
        let [correctName, correctImage] = charactersArray[seriesIndex];

        let options = [];
        options.push(correctName);

        let optionsIndex: number[] = [];
        optionsIndex.push(seriesIndex);

        let randomIndex: number;
        
        for(let i = 0; i< Question.NUMBER_OF_OPTIONS;i++){
            randomIndex = this.getUnusedIndex(charactersArray, optionsIndex);
            const [incorrectName, incorrectImage] = charactersArray[randomIndex];
            options.push(incorrectName);
        }
        options = this.shuffleOptions(options);
        return new CharacterQuestion(correctImage, correctName, options);
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
  