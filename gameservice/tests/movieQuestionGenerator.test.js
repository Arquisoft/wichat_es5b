const { MovieQuestionGenerator } =  require("../src/generators/MovieQuestionGenerator");

test("Generate questions", () => {
    const movies = {
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
    };
    const generator = new MovieQuestionGenerator();
    const questions = generator.generateQuestions(movies, 2);
    expect(questions.length).toBe(2);
});