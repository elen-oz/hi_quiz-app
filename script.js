'use strict';

// todo: V 1) ability to pick difficulty
// todo: 1.а) save to localStotrage

// todo: 2) ability to chose amount of questions
// todo: 2.а) save to localStotrage

// todo: 3) add "Start Again" btn & connect with localStorage

// todo: 4) add Final Message

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

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

const wrapperEl = createElement('div', 'wrapper');
const headerEl = createElement('header', 'header');
const mainEl = createElement('main', 'body');
const footerEl = createElement('footer', 'footer');
footerEl.innerHTML =
  '<a href="https://github.com/elen-oz/hi_quize-app/tree/elena" target="_blank">Source Code</a>';

const containerEl = createElement('div', 'container');
// containerEl.setAttribute('id', 'container');

const gameMessageEl = createElement('div', 'game-message');
gameMessageEl.innerHTML = `Choose the topics you want 🍬`;
const gameScoreEl = createElement('div', 'game-score');
const gameBoardEl = createElement('div', 'game-board');

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

const containerTechBtns = createElement('div', 'container-tech');
const htmlBtnEl = createElement('button', 'button button-tech', 'HTML');
const javascriptBtnEl = createElement(
  'button',
  'button button-tech',
  'JavaScript'
);

const questionsNumberEl = createElement('h2', 'questions-number');
questionsNumberEl.textContent = `Welcome! 🐟 Let's Start!`;

const questionEl = createElement('div', 'question hide');
const answersContainerEl = createElement('div', 'answers-container');

wrapperEl.append(headerEl, mainEl, footerEl);
headerEl.append(questionsNumberEl);
mainEl.append(containerEl);
containerEl.append(gameMessageEl, gameScoreEl, gameBoardEl);
gameBoardEl.append(questionEl, answersContainerEl);

let appEl = document.querySelector('#app');
appEl.append(wrapperEl);

const startGame = () => {
  containerEl.classList.remove('container--final-message');

  gameBoardEl.append(containerNewGameBtnEl);
  containerNewGameBtnEl.append(generalBtnEl, techBtnEl);

  generalBtnEl.addEventListener('click', () => pickDifficulty());
  techBtnEl.addEventListener('click', () => pickTechTopic());
};

startGame();

const pickDifficulty = () => {
  // todo: LocalStorage

  containerNewGameBtnEl.remove();

  gameBoardEl.append(containerDifficultyBtns);
  containerDifficultyBtns.append(easyBtnEl, mediumBtnEl, hardBtnEl);

  easyBtnEl.addEventListener('click', () => getGeneralQuestions('easy'));
  mediumBtnEl.addEventListener('click', () => getGeneralQuestions('medium'));
  hardBtnEl.addEventListener('click', () => getGeneralQuestions('hard'));
};

const pickTechTopic = () => {
  // todo: LocalStorage

  containerNewGameBtnEl.remove();

  gameBoardEl.append(containerTechBtns);
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
  answersContainerEl.innerHTML = '';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  headerEl.append(questionsNumberEl);

  questionEl.classList.remove('hide');
  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button', answer);

    answerEl.addEventListener('click', function () {
      if (answer === correctAnswer) {
        rightAnswers += 1;
        gameMessageEl.textContent = `Correct! 🤜🤛`;
        gameScoreEl.textContent = `Score: ${rightAnswers}`;
      } else {
        gameMessageEl.textContent = `Nope 🦧`;
        gameScoreEl.textContent = `Score: ${rightAnswers}`;
      }

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderGeneralQuestion(questions[currentQuestion]);
      } else {
        showFinalMessage();
        // gameMessageEl.textContent = `Quiz completed 🍭`;
        // questionsNumberEl.innerHTML = 'Final';
        // gameScoreEl.textContent = `Score: ${rightAnswers}`;
        // questionEl.classList.add('hide');
        // answersContainerEl.innerHTML = '';
      }
    });

    answersContainerEl.append(answerEl);
  });
}

function renderTechQuestion(question) {
  containerDifficultyBtns.remove();
  containerTechBtns.remove();
  containerNewGameBtnEl.remove();

  answersContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  headerEl.append(questionsNumberEl);

  questionEl.classList.remove('hide');
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
          gameMessageEl.textContent = `Correct! 🤜🤛`;
          gameScoreEl.textContent = `Score: ${rightAnswers}`;
        } else {
          gameMessageEl.textContent = `Nope 🦧`;
          gameScoreEl.textContent = `Score: ${rightAnswers}`;
        }

        if (currentQuestion < techQuestions.length - 1) {
          currentQuestion += 1;
          renderTechQuestion(techQuestions[currentQuestion]);
        } else {
          showFinalMessage();
          // gameMessageEl.innerHTML = `Quiz completed 🍭`;
          // gameScoreEl.textContent = `Score: ${rightAnswers}`;
          // questionsNumberEl.textContent = 'FINISH';
          // questionEl.classList.add('hide');
          // answersContainerEl.textContent = '';
        }
      });

      answersContainerEl.append(answerEl);
    }
  });
}

const showFinalMessage = () => {
  gameMessageEl.innerHTML = `Quiz completed 🍭`;
  gameScoreEl.textContent = `Score: ${rightAnswers}`;
  questionsNumberEl.textContent = 'FINISH';
  questionEl.classList.add('hide');
  answersContainerEl.textContent = '';

  containerEl.classList.add('container--final-message');
  containerEl.innerHTML = `Quiz completed 🍭 <br> Score: ${rightAnswers}`;
};
