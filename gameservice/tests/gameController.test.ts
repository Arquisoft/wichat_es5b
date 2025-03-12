import {GameController} from "../src/GameController";
import {QuestionManager} from "../src/QuestionManager";
import {AnswerVerifier} from "../src/AnswerVerifier";
import {MovieQuestion} from "../src/questions/MovieQuestion"

let gameController: GameController;

beforeEach(() => {
    const questionGenerator = new QuestionManager();
    const answerVerifier = new AnswerVerifier();
    gameController = new GameController(questionGenerator, answerVerifier);
});

test("Inicio del juego", () => {
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix"));

    gameController.startGame();

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(false);
    // expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Test de Question", () => {
    gameController.startGame();
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");

    expect(gameController.getCurrentQuestion()?.getImage()).toBe("");
    expect(gameController.getCurrentQuestion()?.getOptions()).toEqual(["Star Wars", "Inception", "The Matrix", "Interstellar"]);
    expect(gameController.getCurrentQuestion()?.getCorrectAnswer()).toBe("Interstellar");
});

test("Selección de respuesta correcta", () => {
    gameController.startGame();
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix"));
    gameController.submitAnswer("Interstellar");

    expect(gameController.getScore()).toBe(1);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta incorrecta", () => {
    gameController.startGame();
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Star Wars");

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(true);
});

test("Fin del juego", () => {
    gameController.startGame();
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Interstellar");

    gameController.endGame();
    expect(gameController.isGameEnded()).toBe(true);
});