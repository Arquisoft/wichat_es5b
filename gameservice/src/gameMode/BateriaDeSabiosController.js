const { GameController } = require("../GameController");

class BateriaDeSabiosController extends  GameController {
    doSubmitAnswer(selectedAnswer, timeLeft) {
        if (!this.currentQuestion) {
            console.log("No hay una pregunta activa.");
            return false;
        }
        const isCorrect = this.answerVerifier.verifyAnswer(
            selectedAnswer,
            this.currentQuestion.getCorrectAnswer()
        );

        if (isCorrect) {
            this.score+=this.POINTS_PER_QUESTION;
        }
        console.log(isCorrect);
        this.nextQuestion();
        let isOver = (this.getNumberOfQuestions() <= this.numberOfAnsweredQuestions || timeLeft === 0 || !isCorrect)
        console.log("PRUEBA")
        console.log(timeLeft)
        console.log(this.getNumberOfQuestions() <= this.numberOfAnsweredQuestions)

        return {isCorrect: isCorrect, isOver: isOver};
    }
}
module.exports = { BateriaDeSabiosController };
