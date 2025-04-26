const { GameController } = require("../GameController");

class ClassicGameController extends GameController {
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
            this.score+=this.POINTS_PER_QUESTION+timeLeft;
        }
        this.nextQuestion();
        this.hasGameEnded = this.getNumberOfQuestions() <= this.numberOfAnsweredQuestions
        return {isCorrect: isCorrect, isOver: this.hasGameEnded};
    }
}

module.exports = { ClassicGameController };