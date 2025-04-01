const { AbstractQuestionGenerator } = require("./AbstractQuestionGenerator");
const { Question } = require("../questions/Question");
const { MovieQuestion } = require("../questions/MovieQuestion");
const { movieQuery } = require("./Queries");

class ActorQuestionGenerator extends AbstractQuestionGenerator {

    constructor(){
        super();
        this.query = movieQuery.actorQuery;
    }

    doGenerateQuestion(correctOption , options, data ){
        return new ActorQuestion(data[0], correctOption, options, data[1], data[2]);
    }

    mapResult(queryResult , mappedRes){
        console.log("queryResult: "+queryResult)
        queryResult.results.bindings.forEach((entry) => {
            const character = entry.characterLabel.value;
            const performer = entry.performerLabel.value;
            const movieName = entry.filmTitle.value;
            const image = entry.pic.value;
            mappedRes.set(performer, [image, character, movieName]);
        });
    }    
}

module.exports = { ActorQuestionGenerator };
