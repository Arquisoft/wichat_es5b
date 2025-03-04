import { Question } from "./questions/Question";

export class QuestionGenerator {

    generateQuestion(): Question {
        // Implement the logic to generate a question here
        // Return the generated question
        return new Question("./images/votd_skybox.jpg", [], "Destiny 2");
      }

}