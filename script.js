'use strict';

// todo: 1) ability to pick difficulty
// todo: 1.а) save to localStotrage

// todo: 2) ability to chose amount of questions
// todo: 2.а) save to localStotrage

// todo: 3) remove START QUIZ btn, but leave "Start Again" & connect with localStorage

// todo: 4) change layout to grid https://css-tricks.com/snippets/css/complete-guide-grid/

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

const containerNewGameBtnEl = createElement('div', 'container-newGameButtons');
const generalBtnEl = createElement(
  'button',
  'button button--topics',
  'General Questions'
);
const techBtnEl = createElement(
  'button',
  'button button--topics',
  'Tech Questions'
);
// * --------------- difficulty ------------------
const containerDifficultyBtns = createElement('div', 'container-difficulty');
const easyBtnEl = createElement(
  'button',
  'button button--difficulty',
  'Easy Peasy'
);
const mediumBtnEl = createElement(
  'button',
  'button button--difficulty',
  'Medium'
);
const hardBtnEl = createElement('button', 'button button--difficulty', 'Hard');

// * ------------- tech topic ------------------
const containerTechBtns = createElement('div', 'container-tech');
const htmlBtnEl = createElement('button', 'button button-tech', 'HTML');
const javascriptBtnEl = createElement(
  'button',
  'button button-tech',
  'JavaScript'
);

const questionsNumberEl = createElement('h2', 'questions-number');
const questionEl = createElement('div', 'question');
const buttonContainerEl = createElement('div', 'button-container');
const messageEl = createElement('div', 'message');
messageEl.innerHTML = `Welcome! ⭐️<br>🍬 Let's Start!`;

// containerEl.append(startAgainBtnEl);
containerEl.append(questionsNumberEl, questionEl, buttonContainerEl);

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

let appEl = document.querySelector('#app');
appEl.append(containerEl);
appEl.append(messageEl);

const getParamsNewGame = () => {
  containerEl.append(containerNewGameBtnEl);
  containerNewGameBtnEl.append(generalBtnEl, techBtnEl);

  generalBtnEl.addEventListener('click', () => pickDifficulty());
  techBtnEl.addEventListener('click', () => pickTechTopic());
};

getParamsNewGame();

const pickDifficulty = () => {
  // todo: LocalStorage

  containerNewGameBtnEl.remove();

  containerEl.append(containerDifficultyBtns);
  containerDifficultyBtns.append(easyBtnEl, mediumBtnEl, hardBtnEl);

  easyBtnEl.addEventListener('click', () => getGeneralQuestions('easy'));
  mediumBtnEl.addEventListener('click', () => getGeneralQuestions('medium'));
  hardBtnEl.addEventListener('click', () => getGeneralQuestions('hard'));
};

const pickTechTopic = () => {
  // todo: LocalStorage

  containerNewGameBtnEl.remove();

  containerEl.append(containerTechBtns);
  containerTechBtns.append(htmlBtnEl, javascriptBtnEl);

  htmlBtnEl.addEventListener('click', () => getTechQuestions('HTML'));
  javascriptBtnEl.addEventListener('click', () =>
    getTechQuestions('JavaScript')
  );
};

async function getTechQuestions(topic) {
  let url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${questionsNumber}`;
  let response = await fetch(url);
  let data = await response.json();

  techQuestions = data;
  console.log(techQuestions);

  renderTechQuestion(techQuestions[currentQuestion]);
}

async function getGeneralQuestions(difficulty) {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=9&difficulty=${difficulty}&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderGeneralQuestion(questions[currentQuestion]);
}

function renderGeneralQuestion(question) {
  containerDifficultyBtns.remove();
  containerNewGameBtnEl.remove();
  containerTechBtns.remove();
  buttonContainerEl.innerHTML = '';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);

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

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderGeneralQuestion(questions[currentQuestion]);
      } else {
        // showNewGameBtn();
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
  containerDifficultyBtns.remove();
  containerTechBtns.remove();
  containerNewGameBtnEl.remove();

  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

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
          // showNewGameBtn();
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
