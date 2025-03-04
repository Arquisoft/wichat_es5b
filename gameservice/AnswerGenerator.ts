

export class AnswerGenerator {

    generateAnswers(correctAnswer: string): string[] {
        //TODO: Hacer que las respuestas sean aleatorias
        const answers = [correctAnswer, "ULTRAKILL", "Elden Ring", "Hollow Knight"]
        return answers.sort(() => Math.random() - 0.5);
    }

}