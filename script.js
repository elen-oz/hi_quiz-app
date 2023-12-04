'use strict';

const initialState = {
  questions: [],
  questionsNumber: 10,
  startQuestion: 0,
  rightAnswers: 0,
  emptyLine: '',
};

let questions;
let questionsNumber = initialState.questionsNumber;
let currentQuestion = initialState.startQuestion;
let rightAnswers = initialState.rightAnswers;

const createElement = (tag, classNames, textContent) => {
  const element = document.createElement(tag);
  element.classList.add(...classNames.split(' '));
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
const resultEl = createElement('div', 'result');

containerEl.append(
  startAgainBtnEl,
  questionsNumberEl,
  questionEl,
  buttonContainerEl,
  resultEl
);

let appEl = document.querySelector('#app');
appEl.append(containerEl);

async function getQuestion() {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=9&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderQuestion(questions[currentQuestion]);
}

function renderQuestion(question) {
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
      initialState.rightAnswers += answer === correctAnswer ? 1 : 0;

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion(questions[currentQuestion]);
      } else {
        resultEl.textContent = `Quiz completed. Total right answers: ${rightAnswers}`;
        questionsNumberEl.innerHTML = 'FINISH';

        questionEl.innerHTML = '';
        buttonContainerEl.innerHTML = '';
      }
    });

    buttonContainerEl.append(answerEl);
  });
}

startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = initialState.startQuestion;
  rightAnswers = initialState.rightAnswers;
  resultEl.textContent = initialState.emptyLine;

  getQuestion();
});
