

export class AnswerVerifier {

    // Esto existe en caso de que la verificación cambie en función de la pregunta,
    // para separar funcionalidad en clases
    verifyAnswer(selectedAnswer: string, correctAnswer: string): boolean {
        return selectedAnswer === correctAnswer;
    }

}