const { Question } = require("../questions/Question");
const { shuffle } = require("../util/GameUtil");



class AbstractQuestionGenerator  {

    query ="";

    getQuery(){
        return this.query;
    }

    generateQuestions(queryResult, nQuestions){  
        const mappedRes = new Map();
        this.mapResult(queryResult, mappedRes);

        const array = Array.from(mappedRes);
        
        const questions = new Array(6); 
        const generatedQuestions = new Array(6);

        for (let i = 0; i < 6; i++) {
            questions[i] = this.generateQuestion(array, generatedQuestions);
        }

        return questions;
    }
    
    generateQuestion(array , generatedQuestions ) {
        let movieIndex = this.getUnusedIndex(array.length, generatedQuestions);
        let [correctOption, correctData] =  array[movieIndex];

        let options = [] ;
        options.push(correctOption);

        let optionsIndex = [];
        optionsIndex.push(movieIndex);

        let randomIndex;
        console.log(Question.NUMBER_OF_OPTIONS);
        
        for(let i = 0; i< Question.NUMBER_OF_OPTIONS;i++){
            randomIndex = this.getUnusedIndex(array.length, optionsIndex);
            const [incorrectName, incorrectData] = array[randomIndex];
            options.push(incorrectName);
        }
        options = shuffle(options);
        return this.doGenerateQuestion(correctOption, options, correctData);
    }

    getUnusedIndex(max, generatedIndex){
        let index = this.getRandomIndex(max);
        let count = 0;
        while(generatedIndex.includes(index) && count < max) {
            index = this.getRandomIndex(max);
            count++;
        }
        generatedIndex.push(index);
        return index;
    }

    getRandomIndex(max ){
        return Math.floor(Math.random() * max);
    }

    doGenerateQuestion(correctOption , options, data ){
        throw new Error("sin implementar");
    };

    mapResult(queryResult , mappedRes){
        throw new Error("sin implementar");
    }
}

module.exports = { AbstractQuestionGenerator };

  