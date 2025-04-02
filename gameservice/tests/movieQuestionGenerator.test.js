const { MovieQuestionGenerator } =  require("../src/generators/MovieQuestionGenerator");

test("Generate questions", () => {
    const movies = new Map([["movie1", "image1"], ["movie2", "image2"]]);
    const generator = new MovieQuestionGenerator();
    const questions = generator.generateQuestions(movies, 2);
    expect(questions.length).toBe(2);
});