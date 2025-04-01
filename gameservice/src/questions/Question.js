class Question {

    static NUMBER_OF_OPTIONS = 3;
    constructor(imageUrl, correctAnswer, options) {
        this.imageUrl = imageUrl;
        if (options != undefined) this.options = options;
        else this.options = [];
        this.correctAnswer = correctAnswer;
        
    }

    /**
     * Establece las opciones para esta pregunta.
     * 
     * @param answers - Un array de respuestas posibles para esta pregunta.
     */
    setOptions(answers) {
        this.options = answers;
    }

    /**
     * Devuelve la respuesta correcta para esta pregunta.
     * @returns La respuesta correcta.
     */
    getCorrectAnswer() {
        return this.correctAnswer;
    }

    /**
     * Devuelve las opciones de respuesta para esta pregunta.
     * 
     * @returns Un array de cadenas que representa las opciones de respuesta.
     */
    getOptions() {
        return this.options;
    }

    /**
     * Devuelve la URL de la imagen asociada con esta pregunta.
     * @returns La URL de la imagen.
     */
    getImage() {
        return this.imageUrl;
    }
}

module.exports = { Question };