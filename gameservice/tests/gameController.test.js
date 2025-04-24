const { ClassicGameController } = require("../src/gameMode/ClassicGameController");
const { QuestionManager } = require("../src/QuestionManager");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { MovieQuestion } = require("../src/questions/MovieQuestion");

let gameController;
let questionManager;
let answerVerifier;

beforeEach(() => {
    questionManager = new QuestionManager();
    answerVerifier = new AnswerVerifier();
    gameController = new ClassicGameController(questionManager, answerVerifier);
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
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));

    jest.spyOn(gameController.getQuestionManager(), 'generateQuestions').mockImplementation((nQuestions) => {
        return Promise.resolve();
    });
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

    expect(gameController.getScore()).toBe(gameController.POINTS_PER_QUESTION);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta correcta con tiempo sobrante", () => {
    let timeLeft = 10;
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.submitAnswer("Interstellar", timeLeft);

    expect(gameController.getScore()).toBe(gameController.POINTS_PER_QUESTION+timeLeft);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta correcta utilizando dos pistas con los botones", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.hintUsed(0)
    gameController.hintUsed(1)
    gameController.submitAnswer("Interstellar",0);

    expect(gameController.getScore()).toBe(gameController.POINTS_PER_QUESTION - 15);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta correcta utilizando dos pistas con el chat", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.chatBotUsed()
    gameController.chatBotUsed()
    gameController.submitAnswer("Interstellar",0);

    expect(gameController.getScore()).toBe(gameController.POINTS_PER_QUESTION - 40);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta incorrecta", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));
    gameController.submitAnswer("Star Wars", 0);

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(false);
});

test("Fin del juego", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.submitAnswer("Interstellar", 30);

    gameController.endGame();
    expect(gameController.isGameEnded()).toBe(true);
});

test("Se devuelve una respuesta sin haber pregunta", () => {
    expect(gameController.getCurrentQuestion()).toBeNull();

    gameController.submitAnswer("Interstellar", 30);

    expect(gameController.getCurrentQuestion()).toBeNull();
    expect(gameController.getScore()).toBe(0);
});

test("Se acaba el tiempo", () => {
    gameController.setQuestion("", ["Star Wars", "Inception", "The Matrix", "Interstellar"], "Interstellar");
    gameController.getQuestionManager().pushQuestion(new MovieQuestion("", "The Matrix", ["Star Wars", "Inception", "The Matrix", "Interstellar"]));

    gameController.submitAnswer("",0);
    expect(gameController.getScore()).toBe(0);
    expect(gameController.getCurrentQuestion()).not.toBeNull(); 
})