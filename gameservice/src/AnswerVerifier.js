

class AnswerVerifier {

    // Esto existe en caso de que la verificación cambie en función de la pregunta,
    // para separar funcionalidad en clases
    verifyAnswer(selectedAnswer, correctAnswer) {
        return selectedAnswer == null ? false : selectedAnswer === correctAnswer;
    }

}

module.exports = { AnswerVerifier };