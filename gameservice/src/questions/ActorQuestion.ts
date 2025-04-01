import { Question } from "./Question";

export class ActorQuestion extends Question {
    
    private actorName : string;
    private characterName: string;
    private movieName: string;
    private question : string;

    
    constructor(url: string, correctAnswer: string, options: string[] , characterName :string, movieName: string) {
        super(url, correctAnswer, options);
        this.actorName = correctAnswer;
        this.characterName = characterName;
        this.movieName = movieName;
        this.question = `¿Quién interpreta a ${this.characterName} en la película ${this.movieName}?`;
    }

    getQuestion(): String {
        return this.question;
    }
}