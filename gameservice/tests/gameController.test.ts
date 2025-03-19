import {GameController} from "../src/GameController";
import {QuestionManager} from "../src/QuestionManager";
import {AnswerVerifier} from "../src/AnswerVerifier";
import {MovieQuestion} from "../src/questions/MovieQuestion"

let gameController: GameController;
let questionManager: QuestionManager;
let answerVerifier: AnswerVerifier;

beforeEach(() => {
    questionManager = new QuestionManager();
    answerVerifier = new AnswerVerifier();
    gameController = new GameController(questionManager, answerVerifier);
});

test("Inicio del juego", async () => {
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));

    jest.spyOn(gameController.getQuestionManager(), 'generateQuestions').mockImplementation((nQuestions: number) => {
        return Promise.resolve();
    });
    await gameController.startGame();

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Test de Question", () => {
    gameController.startGame();
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");

    expect(gameController.getCurrentQuestion()?.getImage()).toBe("");
    expect(gameController.getCurrentQuestion()?.getOptions()).toEqual(["Star Wars", "Inception", "The Matrix", "Interstellar"]);
    expect(gameController.getCurrentQuestion()?.getCorrectAnswer()).toBe("Interstellar");
});

test("Selección de respuesta correcta", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.submitAnswer("Interstellar");

    expect(gameController.getScore()).toBe(1);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta incorrecta", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Star Wars");

    expect(gameController.getScore()).toBe(-1);
    expect(gameController.isGameEnded()).toBe(false);
});

test("Fin del juego", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Interstellar");

    gameController.endGame();
    expect(gameController.isGameEnded()).toBe(true);
});

test("Se devuelve una respuesta sin haber pregunta", () => {
    expect(gameController.getCurrentQuestion()).toBeNull();

    gameController.submitAnswer("Interstellar");

    expect(gameController.getCurrentQuestion()).toBeNull();
    expect(gameController.getScore()).toBe(0);
});