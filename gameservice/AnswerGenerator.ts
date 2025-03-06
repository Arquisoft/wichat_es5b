

export class AnswerGenerator {

    generateAnswers(correctAnswer: string): string[] {
        //TODO: Hacer que las respuestas sean aleatorias
        const answers = [correctAnswer, "Respuesta 1", "Respuesta 2", "Respuesta 3"]
        return answers.sort(() => Math.random() - 0.5);
    }

}