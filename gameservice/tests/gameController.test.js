const { GameController } = require("../src/GameController");
const { QuestionManager } = require("../src/QuestionManager");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { MovieQuestion } = require("../src/questions/MovieQuestion");

let gameController;
let questionManager;
let answerVerifier;

beforeEach(() => {
    questionManager = new QuestionManager();
    answerVerifier = new AnswerVerifier();
    gameController = new GameController(questionManager, answerVerifier);
});

test("Inicio del juego", async () => {
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));

    jest.spyOn(gameController.getQuestionManager(), 'generateQuestions').mockImplementation((nQuestions) => {
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
    gameController.submitAnswer("Interstellar", 0);

    expect(gameController.getScore()).toBe(100);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta incorrecta", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Star Wars",0);

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(false);
});

test("Fin del juego", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Interstellar",0);

    gameController.endGame();
    expect(gameController.isGameEnded()).toBe(true);
});

test("Se devuelve una respuesta sin haber pregunta", () => {
    expect(gameController.getCurrentQuestion()).toBeNull();

    gameController.submitAnswer("Interstellar",0);

    expect(gameController.getCurrentQuestion()).toBeNull();
    expect(gameController.getScore()).toBe(0);
});

test("Se acaba el tiempo", () => {
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "Inception", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.timeOver();

    expect(gameController.getScore()).toBe(-1);
    expect(gameController.getCurrentQuestion()).not.toBeNull(); 
})