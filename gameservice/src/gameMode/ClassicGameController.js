const { GameController } = require("../GameController");

class ClassicGameController extends GameController {
    submitAnswer(selectedAnswer, timeLeft) {
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
        console.log(isCorrect);
        this.nextQuestion();
        return isCorrect;
    }
}

module.exports = { ClassicGameController };