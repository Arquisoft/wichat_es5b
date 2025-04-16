const { GameController } = require("../GameController");

class BateriaDeSabiosController extends  GameController {
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
            this.score+=this.POINTS_PER_QUESTION;
        }
        console.log(isCorrect);
        this.nextQuestion();
        return isCorrect;
    }
}
module.exports = { BateriaDeSabiosController };
