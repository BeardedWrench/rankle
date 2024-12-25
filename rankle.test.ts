import { Rankle, QuestionnaireQuestionAnswer } from './rankle';

describe('Rankle', () => {
  const rankle = new Rankle();

  const exampleJson = `{
    "name": "What weed strain are you?",
    "questions": [
      {
        "id": "1",
        "question": "What is your favorite color?",
        "answers": [
          {
            "id": "1",
            "answer": "Red",
            "weights": [
              { "resultID": "1", "weight": 0.9 },
              { "resultID": "2", "weight": 0.4 },
              { "resultID": "3", "weight": 0.1 }
            ]
          },
          {
            "id": "2",
            "answer": "Blue",
            "weights": [
              { "resultID": "1", "weight": 0.2 },
              { "resultID": "2", "weight": 1.0 },
              { "resultID": "3", "weight": 0.5 }
            ]
          }
        ]
      },
      {
        "id": "2",
        "question": "What is your favorite scary movie?",
        "answers": [
          {
            "id": "1",
            "answer": "Scream",
            "weights": [
              { "resultID": "1", "weight": 1.0 },
              { "resultID": "2", "weight": 0.3 },
              { "resultID": "3", "weight": 0.7 }
            ]
          },
          {
            "id": "2",
            "answer": "Chucky",
            "weights": [
              { "resultID": "1", "weight": 0.8 },
              { "resultID": "2", "weight": 0.1 },
              { "resultID": "3", "weight": 0.3 }
            ]
          }
        ]
      }
    ],
    "results": [
      { "id": "1", "result": "Witch Doctor OG" },
      { "id": "2", "result": "Northern Lights" },
      { "id": "3", "result": "NY Sour Diesel" }
    ]
  }`;

  it('should calculate correct result based on weights', () => {
    const answers: QuestionnaireQuestionAnswer[] = [
      { questionID: '1', answerID: '1' }, // Red (weights: 0.9, 0.4, 0.1)
      { questionID: '2', answerID: '1' }, // Scream (weights: 1.0, 0.3, 0.7)
    ];

    // Expected weights:
    // Result 1 (Witch Doctor OG): 0.9 + 1.0 = 1.9
    // Result 2 (Northern Lights): 0.4 + 0.3 = 0.7
    // Result 3 (NY Sour Diesel): 0.1 + 0.7 = 0.8

    const result = rankle.rankle(exampleJson, answers);
    expect(result.result).toBe('Witch Doctor OG');
  });

  it('should throw error for invalid question ID', () => {
    const answers: QuestionnaireQuestionAnswer[] = [
      { questionID: '999', answerID: '1' },
    ];

    expect(() => {
      rankle.rankle(exampleJson, answers);
    }).toThrow('Question with ID 999 not found');
  });

  it('should throw error for invalid answer ID', () => {
    const answers: QuestionnaireQuestionAnswer[] = [
      { questionID: '1', answerID: '999' },
    ];

    expect(() => {
      rankle.rankle(exampleJson, answers);
    }).toThrow('Answer with ID 999 not found for question 1');
  });

  it('should throw error for invalid JSON', () => {
    const answers: QuestionnaireQuestionAnswer[] = [
      { questionID: '1', answerID: '1' },
    ];

    expect(() => {
      rankle.rankle('invalid json', answers);
    }).toThrow('Invalid JSON format');
  });
});
