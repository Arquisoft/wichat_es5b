import { MovieQuestionGenerator } from "../src/generators/MovieQuestionGenerator";

test("Generate questions", () => {
    const movies = new Map<string, string>([["movie1", "image1"], ["movie2", "image2"]]);
    const generator = new MovieQuestionGenerator();
    const questions = generator.generateQuestions(movies, 2);
    expect(questions.length).toBe(2);
});