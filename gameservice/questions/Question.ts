

export class Question {

    constructor(imageUrl: string, options: string[], correctAnswer: string) {
        this.imageUrl = imageUrl;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    imageUrl: string;
    options: string[];
    correctAnswer: string;
}