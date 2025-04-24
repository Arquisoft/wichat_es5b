const { BateriaDeSabiosController } = require("../src/gameMode/BateriaDeSabiosController");
const { QuestionManager } = require("../src/QuestionManager");
const { AnswerVerifier } = require("../src/AnswerVerifier");
const { ActorQuestion } = require("../src/questions/ActorQuestion");
const { CharacterQuestion } = require("../src/questions/CharacterQuestion");


let gameController;
let questionManager;
let answerVerifier;
let q1, q2;

beforeEach(() => {
    questionManager = new QuestionManager();
    answerVerifier = new AnswerVerifier();
    gameController = new BateriaDeSabiosController(questionManager, answerVerifier);
    q1 = new ActorQuestion("", "Susanne Blakeslee", ["'Oliver Jackson-Cohen", "Wentworth Miller", "Josh Pais", "Susanne Blakeslee"],
        "Cruella de Vil", "102 Dalmatians")
    q2 = new CharacterQuestion("", "Descent", ["Revenge", "Rise of the Teenage Mutant Ninja Turtles", "Batman: Under the Red Hood","Descent"],
        "Deanna Troi")
});

test("Selección de respuesta correcta", () => {
    gameController.currentQuestion = q1;
    gameController.getQuestionManager().pushQuestion(q2);
    gameController.submitAnswer("Susanne Blakeslee", 10);

    expect(gameController.getScore()).toBe(gameController.POINTS_PER_QUESTION);
    expect(gameController.isGameEnded()).toBe(false);
    expect(gameController.getCurrentQuestion()).not.toBeNull();
});

test("Selección de respuesta incorrecta", () => {
    gameController.currentQuestion = q1;
    gameController.getQuestionManager().pushQuestion(q2);
    gameController.submitAnswer("Josh Pais", 10);

    expect(gameController.getScore()).toBe(0);
    expect(gameController.isGameEnded()).toBe(true);
});