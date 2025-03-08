

export class AnswerGenerator {

    private possibleAnswers: string[];

    constructor() {
        this.possibleAnswers = [];
    }

    /**
     * Genera una lista de respuestas posibles para una pregunta. Si la lista de respuestas posibles no es suficiente,
     * se agregan algunas respuestas por defecto. De lo contrario, se seleccionan tres respuestas aleatorias de la lista
     * y se agrega la respuesta correcta. La lista de respuestas se desordena aleatoriamente.
     * 
     * @param correctAnswer La respuesta correcta para la pregunta.
     * @returns Una lista de respuestas posibles para la pregunta.
     */
    generateAnswers(correctAnswer: string): string[] {
        let answers: string[];
        if (this.possibleAnswers.length < 3) {
            answers = [correctAnswer, "Respuesta 1", "Respuesta 2", "Respuesta 3"];
        } else {
            let randomAnswers = [];
            this.possibleAnswers.sort(() => Math.random() - 0.5);
            let ans1 = this.possibleAnswers[Math.random() * (this.possibleAnswers.length / 3)];
            let ans2 = this.possibleAnswers[Math.random() * (this.possibleAnswers.length / 3) + (this.possibleAnswers.length / 3)];
            let ans3 = this.possibleAnswers[Math.random() * (this.possibleAnswers.length / 3) + 2 * (this.possibleAnswers.length / 3)];
            answers = [correctAnswer, ans1, ans2, ans3];
        }
        return answers.sort(() => Math.random() - 0.5);
    }

    /**
     * Añade una nueva respuesta a la lista de respuestas posibles.
     * @param {string} answer - La nueva respuesta a agregar.
     */
    addAnswer(answer: string): void {
        this.possibleAnswers.push(answer);
    }

}