const { AbstractQuestionGenerator } = require("./AbstractQuestionGenerator");
const { MovieQuestion } = require("../questions/MovieQuestion");
const { movieQuery } = require("./Queries");

class MovieQuestionGenerator extends AbstractQuestionGenerator {
    
   constructor(){
        super()
        this.query = movieQuery;
    }

    doGenerateQuestion(correctOption , options, data ){
        return new MovieQuestion(data[0], correctOption, options);
    }

    mapResult(queryResult, mappedRes){
        queryResult.results.bindings.forEach((entry) => {
            const movieName = entry.itemLabel.value;
            const image = entry.pic.value;
            mappedRes.set(movieName, [image]);
        });
    }
}

module.exports = { MovieQuestionGenerator };
  