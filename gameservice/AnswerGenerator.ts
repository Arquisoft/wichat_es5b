

export class AnswerGenerator {

    generateAnswers(correctAnswer: string): string[] {
        //TODO: Hacer que las respuestas sean aleatorias
        const answers = [correctAnswer, "Incorrect answer 1", "Incorrect answer 2", "Incorrect answer 3"]
        return answers.sort(() => Math.random() - 0.5);
    }

}