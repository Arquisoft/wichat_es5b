const { Question } = require("../questions/Question");
const { shuffle } = require("../util/GameUtil");

class AbstractQuestionGenerator  {

    query ="";

    nOptions= 4;

    getQuery(){
        return this.query;
    }

    generateQuestions(queryResult, nQuestions, nOptions) {
        this.nOptions = nOptions;
        const mappedRes = new Map();
        this.mapResult(queryResult, mappedRes);

        const array = Array.from(mappedRes);

        const questions = new Array(nQuestions);
        const usedIndices = new Set();

        console.log("Antes de generar");

        for (let i = 0; i < nQuestions; i++) {
            questions[i] = this.generateQuestion(array, usedIndices);
        }

        console.log("Después de generar");

        return questions;
    }

    generateQuestion(array, usedIndices) {
        let movieIndex = this.getUnusedIndex(array.length, usedIndices);
        let [correctOption, correctData] = array[movieIndex];

        let options = [correctOption];
        let optionIndices = new Set([movieIndex]);

        while (options.length < this.nOptions) {
            let randomIndex = this.getUnusedIndex(array.length, optionIndices);
            const [incorrectName] = array[randomIndex];
            options.push(incorrectName);
        }

        options = shuffle(options);

        return this.doGenerateQuestion(correctOption, options, correctData);
    }

    getUnusedIndex(max, usedIndices) {
        if (usedIndices.size >= max) {
            throw new Error("No hay más índices disponibles para seleccionar.");
        }
        let index;
        do {
            index = this.getRandomIndex(max);
        } while (usedIndices.has(index));
        usedIndices.add(index);
        return index;
    }

    getRandomIndex(max) {
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

  