

export class Question {

    constructor(imageUrl: string, correctAnswer: string) {
        this.imageUrl = imageUrl;
        this.options = [];
        this.correctAnswer = correctAnswer;
    }

    private readonly imageUrl: string;
    private options: string[];
    private readonly correctAnswer: string;

    /**
     * Establece las opciones para esta pregunta.
     * 
     * @param answers - Un array de respuestas posibles para esta pregunta.
     */
    setOptions(answers: string[]): void {
        this.options = answers;
    }

    /**
     * Devuelve la respuesta correcta para esta pregunta.
     * @returns La respuesta correcta.
     */
    getCorrectAnswer(): string {
        return this.correctAnswer;
    }

    /**
     * Devuelve las opciones de respuesta para esta pregunta.
     * 
     * @returns Un array de cadenas que representa las opciones de respuesta.
     */
    getOptions(): string[] {
        return this.options;
    }

    /**
     * Devuelve la URL de la imagen asociada con esta pregunta.
     * @returns La URL de la imagen.
     */
    getImage(): string {
        return this.imageUrl;
    }
}