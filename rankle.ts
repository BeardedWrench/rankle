interface QuestionnaireResult {
  id: string;
  result: string;
}
interface QuestionnaireQuestionOption {
  answer: string;
  weights: {
    weight: number;
    resultID: string;
  };
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

const testInput = {
  questions: [
    {
      questionID: '1',
      answerID: '3',
    },
    {
      questionID: '2',
      answerID: '1',
    },
  ],
};

export class Rankle {
  public rankle(
    inputJson: string,
    answers: QuestionnaireQuestionAnswer[]
  ): QuestionnaireResult {
    const questionnaire = this.translateJSON(inputJson);
  }

  private translateJSON(inputJson: string): Questionnaire {
    return JSON.parse(inputJson);
  }

  private calculateResult(
    questionnaire: Questionnaire,
    answers: QuestionnaireQuestionAnswer[]
  ) {}
}
