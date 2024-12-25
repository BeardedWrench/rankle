interface QuestionnaireResult {
  id: string;
  result: string;
}

interface QuestionnaireQuestionOption {
  id: string;
  answer: string;
  weights: {
    resultID: string;
    weight: number;
  }[];
}

interface QuestionnaireQuestion {
  id: string;
  question: string;
  answers: QuestionnaireQuestionOption[];
}

interface Questionnaire {
  name: string;
  questions: QuestionnaireQuestion[];
  results: QuestionnaireResult[];
}

export interface QuestionnaireQuestionAnswer {
  questionID: string;
  answerID: string;
}

export class Rankle {
  public rankle(
    inputJson: string,
    answers: QuestionnaireQuestionAnswer[]
  ): QuestionnaireResult {
    try {
      const questionnaire = this.translateJSON(inputJson);
      this.validateInput(questionnaire, answers);
      return this.calculateResult(questionnaire, answers);
    } catch (error) {
      throw new Error(`Failed to process questionnaire: ${error.message}`);
    }
  }

  private translateJSON(inputJson: string): Questionnaire {
    try {
      return JSON.parse(inputJson);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
  }

  private validateInput(
    questionnaire: Questionnaire,
    answers: QuestionnaireQuestionAnswer[]
  ) {
    // Validate that all answered questions exist in the questionnaire
    for (const answer of answers) {
      const question = questionnaire.questions.find(
        (q) => q.id === answer.questionID
      );
      if (!question) {
        throw new Error(`Question with ID ${answer.questionID} not found`);
      }

      // Validate that the answered option exists for the question
      const option = question.answers.find((a) => a.id === answer.answerID);
      if (!option) {
        throw new Error(
          `Answer with ID ${answer.answerID} not found for question ${answer.questionID}`
        );
      }
    }
  }

  private calculateResult(
    questionnaire: Questionnaire,
    answers: QuestionnaireQuestionAnswer[]
  ): QuestionnaireResult {
    // Initialize weights for each possible result
    const resultWeights = new Map<string, number>();
    questionnaire.results.forEach((result) => {
      resultWeights.set(result.id, 0);
    });

    // Sum up weights for each answer
    for (const answer of answers) {
      const question = questionnaire.questions.find(
        (q) => q.id === answer.questionID
      )!;
      const selectedAnswer = question.answers.find(
        (a) => a.id === answer.answerID
      )!;

      // Add weights for each possible result
      for (const weight of selectedAnswer.weights) {
        const currentWeight = resultWeights.get(weight.resultID) || 0;
        resultWeights.set(weight.resultID, currentWeight + weight.weight);
      }
    }

    // Find the result with the highest total weight
    let highestWeight = -1;
    let winningResultId = '';

    resultWeights.forEach((weight, resultId) => {
      if (weight > highestWeight) {
        highestWeight = weight;
        winningResultId = resultId;
      }
    });

    // Find and return the corresponding result
    const winningResult = questionnaire.results.find(
      (r) => r.id === winningResultId
    );
    if (!winningResult) {
      throw new Error('Failed to determine result');
    }

    return winningResult;
  }
}
