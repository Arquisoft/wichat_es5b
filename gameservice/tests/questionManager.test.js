const { QuestionManager } = require("../src/QuestionManager");
const {MovieQuestionGenerator} = require("../src/generators/MovieQuestionGenerator");

let questionManager;

beforeEach(() => {
    questionManager = new QuestionManager();
});

test("Generate questions", async () => {
    jest.spyOn(questionManager, 'executeQuery').mockImplementation(() => {
        return Promise.resolve({
            "head": {
              "vars": ["itemLabel", "pic"]
            },
            "results": {
              "bindings": [
                {
                  "itemLabel": {
                    "type": "literal",
                    "value": "Interstellar"
                  },
                  "pic": {
                    "type": "literal",
                    "value": "Image1"
                  }
                },
                {
                  "itemLabel": {
                    "type": "literal",
                    "value": "TheMatrix"
                  },
                  "pic": {
                    "type": "literal",
                    "value": "Image2"
                  }
                }
              ]
            }
          });
    })
    questionManager.generator = [new MovieQuestionGenerator()]
    await questionManager.generateQuestions(2);
    expect(questionManager.getQuestionList().length).toBe(2);
    expect(questionManager.areThereQuestionsLeft()).toBe(true);
    expect(questionManager.getNextQuestion()).not.toBeNull();
});