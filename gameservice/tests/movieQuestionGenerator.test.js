const { MovieQuestionGenerator } =  require("../src/generators/MovieQuestionGenerator");

test("Generate questions", () => {
    const movies = [{itemLabel:{ value: "movie1"},pic: { value: "image1"}}, {itemLabel:{ value: "movie2"},pic: { value: "image2"}}];
    const generator = new MovieQuestionGenerator();
    const questions = generator.generateQuestions({results: movies}, 2);
    expect(questions.length).toBe(2);
});