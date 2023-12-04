'use strict';

const initialState = {
  questions: [],
  questionsNumber: 10,
  startQuestion: 0,
  rightAnswers: 0,
  emptyLine: '',
  message: `Good luck! 🍀`,
};

let questions;
let techQuestions;
let questionsNumber = initialState.questionsNumber;
let currentQuestion = initialState.startQuestion;
let rightAnswers = initialState.rightAnswers;

const createElement = (tag, classNames, textContent) => {
  const element = document.createElement(tag);
  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }
  element.textContent = textContent !== undefined ? textContent : '';
  return element;
};

const containerEl = createElement('div', 'container');
containerEl.setAttribute('id', 'container');

const startAgainBtnEl = createElement(
  'button',
  'button button--again',
  'Start Quiz'
);

const questionsNumberEl = createElement('h2', 'questions-number');
const questionEl = createElement('div', 'question');
const buttonContainerEl = createElement('div', 'button-container');
const messageEl = createElement('div', 'message');
messageEl.textContent = `Good luck! 🍀`;

containerEl.append(
  startAgainBtnEl,
  questionsNumberEl,
  questionEl,
  buttonContainerEl
);

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';
// const apiTags = {
//   HTML: HTML,
//   JavaScript: JavaScript,
// };

// https://quizapi.io/api/v1/questions?apiKey=Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980&tags=JavaScript

let appEl = document.querySelector('#app');
appEl.append(containerEl);
appEl.append(messageEl);

async function getTechQuestions() {
  let url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=JavaScript&limit=${questionsNumber}`;
  let response = await fetch(url);
  let data = await response.json();

  techQuestions = data;
  console.log(techQuestions);

  renderTechQuestion(techQuestions[currentQuestion]);
}

async function getGeneralQuestions() {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=9&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderGeneralQuestion(questions[currentQuestion]);
}

function renderGeneralQuestion(question) {
  buttonContainerEl.innerHTML = '';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);
  startAgainBtnEl.textContent = 'Start Again';
  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button', answer);

    answerEl.addEventListener('click', function () {
      if (correctAnswer) {
        initialState.rightAnswers += 1;
        messageEl.textContent = `Correct! 🤜🤛`;
      } else {
        messageEl.textContent = `Nope 🦧`;
      }
      //   initialState.rightAnswers += answer === correctAnswer ? 1 : 0;

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderGeneralQuestion(questions[currentQuestion]);
      } else {
        messageEl.textContent = `Quiz completed 🍭<br>Right answers: ${rightAnswers}`;
        questionsNumberEl.innerHTML = 'FINISH';

        questionEl.innerHTML = '';
        buttonContainerEl.innerHTML = '';
      }
    });

    buttonContainerEl.append(answerEl);
  });
}

function renderTechQuestion(question) {
  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  startAgainBtnEl.textContent = 'Start Again';
  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);
  questionEl.textContent = question.question;

  let answers = question.answers;
  let correctAnswers = question.correct_answers;

  Object.keys(answers).forEach((key) => {
    if (answers[key] !== null) {
      let answerEl = document.createElement('button');
      answerEl.textContent = answers[key];
      answerEl.classList.add('button');

      answerEl.addEventListener('click', function () {
        let isCorrect = correctAnswers[key + '_correct'] === 'true';

        if (isCorrect) {
          rightAnswers += 1;
          messageEl.textContent = `Correct! 🤜🤛`;
        } else {
          messageEl.textContent = `Nope 🦧`;
        }

        if (currentQuestion < techQuestions.length - 1) {
          currentQuestion += 1;
          renderTechQuestion(techQuestions[currentQuestion]);
        } else {
          messageEl.innerHTML = `Quiz completed 🍭<br>Right answers: ${rightAnswers}`;
          questionsNumberEl.textContent = 'FINISH';
          questionEl.textContent = '';
          buttonContainerEl.textContent = '';
        }
      });

      buttonContainerEl.append(answerEl);
    }
  });
}

startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = initialState.startQuestion;
  rightAnswers = initialState.rightAnswers;
  messageEl.textContent = initialState.message;

  //   getGeneralQuestions();
  getTechQuestions();
});
