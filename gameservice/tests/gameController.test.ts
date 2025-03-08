import {GameController} from "../src/GameController";
import {QuestionGenerator} from "../src/QuestionGenerator";
import {AnswerGenerator} from "../src/AnswerGenerator";
import {AnswerVerifier} from "../src/AnswerVerifier";

test("Inicio del juego", () => {
    const questionGenerator = new QuestionGenerator();
    const answerGenerator = new AnswerGenerator();
    const answerVerifier = new AnswerVerifier();
    const gameController = new GameController(questionGenerator, answerGenerator, answerVerifier);
    gameController.startGame();

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});