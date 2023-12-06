'use strict';

// todo: 2) ability to chose amount of questions

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

const initialState = {
  questions: [],
  questionsNumber: 10,
  startQuestion: 0,
  score: 0,
};

const currentState = {
  questions: [...initialState.questions],
  questionsNumber: initialState.questionsNumber,
  currentQuestionIndex: initialState.startQuestion,
  score: initialState.score,
};

async function getTechQuestions(topic) {
  let url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${currentState.questionsNumber}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data;
  console.log(currentState.questions);

  renderTechQuestion(currentState.questions[currentState.currentQuestionIndex]);
}

async function getGeneralQuestions(difficulty) {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionsNumber}&category=9&difficulty=${difficulty}&type=multiple`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data.results;
  console.log(currentState.questions);

  renderGeneralQuestion(
    currentState.questions[currentState.currentQuestionIndex]
  );
}

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
const mainEl = createElement('main', 'main');
const playAgainBtnEl = createElement(
  'button',
  'button button--again',
  'Restart'
);
const footerEl = createElement('footer', 'footer');
const containerEl = createElement('div', 'container');
const gameMessageEl = createElement('div', 'game-message');
const gameScoreEl = createElement('div', 'game-score');
const gameBoardEl = createElement('div', 'game-board');
const questionsNumberEl = createElement('h2', 'questions-number');
const questionEl = createElement('div', 'question hide');
const answersContainerEl = createElement('div', 'answers-container');

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

wrapperEl.append(headerEl, mainEl, footerEl);
headerEl.append(playAgainBtnEl);

document.querySelector('#app').append(wrapperEl);

footerEl.innerHTML =
  '<a href="https://github.com/elen-oz/hi_quize-app/tree/elena" target="_blank">Source Code</a>';
questionsNumberEl.textContent = `Welcome! 🐟 Let's Start!`;
gameMessageEl.innerHTML = `Choose the topics you want 🍬`;

const renderStartGame = () => {
  containerEl.classList.remove('container--final-message');

  mainEl.append(questionsNumberEl);
  mainEl.append(containerEl);
  containerEl.append(
    gameMessageEl,
    gameScoreEl,
    gameBoardEl,
    answersContainerEl
  );
  gameBoardEl.append(questionEl);

  gameBoardEl.append(containerNewGameBtnEl);
  containerNewGameBtnEl.append(generalBtnEl, techBtnEl);
};

const startGame = () => {
  removeEventListeners();
  renderStartGame();

  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
};

const renderPickDifficultyStage = () => {
  containerNewGameBtnEl.remove();

  gameMessageEl.innerHTML = `What level of difficulty? ⚔️`;

  gameBoardEl.append(containerDifficultyBtns);
  containerDifficultyBtns.append(easyBtnEl, mediumBtnEl, hardBtnEl);
};

const handleDifficultyClick = () => pickDifficulty();
const handleTechTopicClick = () => pickTechTopic();
const handleEasyClick = () => getGeneralQuestions('easy');
const handleMediumClick = () => getGeneralQuestions('medium');
const handleHardClick = () => getGeneralQuestions('hard');
const handleQuestionsHtmlClick = () => getTechQuestions('HTML');
const handleQuestionsJavascriptClick = () => getTechQuestions('JavaScript');

function removeEventListeners() {
  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
  easyBtnEl.removeEventListener('click', handleEasyClick);
  mediumBtnEl.removeEventListener('click', handleMediumClick);
  hardBtnEl.removeEventListener('click', handleHardClick);
  htmlBtnEl.removeEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.removeEventListener('click', handleQuestionsJavascriptClick);
}

const pickDifficulty = () => {
  // todo: LocalStorage
  renderPickDifficultyStage();
  removeEventListeners();

  easyBtnEl.addEventListener('click', handleEasyClick);
  mediumBtnEl.addEventListener('click', handleMediumClick);
  hardBtnEl.addEventListener('click', handleHardClick);
};

const renderPickTechTopicStage = () => {
  containerNewGameBtnEl.remove();

  gameBoardEl.append(containerTechBtns);
  containerTechBtns.append(htmlBtnEl, javascriptBtnEl);
};

const pickTechTopic = () => {
  // todo: LocalStorage
  renderPickTechTopicStage();
  removeEventListeners();

  htmlBtnEl.addEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.addEventListener('click', handleQuestionsJavascriptClick);
};

const renderMessageAndScore = (isTrue) => {
  if (isTrue) {
    gameMessageEl.innerHTML = `Correct! 🎯`;
    gameScoreEl.textContent = `Score: ${currentState.score}`;
  } else {
    gameMessageEl.innerHTML = `Nope 🦧`;
    gameScoreEl.textContent = `Score: ${currentState.score}`;
  }
};

function renderGeneralQuestion(question) {
  containerDifficultyBtns.remove();
  containerNewGameBtnEl.remove();
  containerTechBtns.remove();
  answersContainerEl.innerHTML = '';

  questionsNumberEl.textContent = `${currentState.currentQuestionIndex + 1} / ${
    currentState.questionsNumber
  }`;

  questionEl.classList.remove('hide');
  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button', answer);

    answerEl.addEventListener('click', function () {
      let isCorrect = answer === correctAnswer;

      isCorrect && currentState.score++;
      renderMessageAndScore(isCorrect);

      if (
        currentState.currentQuestionIndex <
        currentState.questions.length - 1
      ) {
        currentState.currentQuestionIndex += 1;
        renderGeneralQuestion(
          currentState.questions[currentState.currentQuestionIndex]
        );
      } else {
        showFinalMessage();
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

  questionsNumberEl.textContent = `${currentState.currentQuestionIndex + 1} / ${
    currentState.questionsNumber
  }`;

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

        isCorrect && currentState.score++;
        renderMessageAndScore(isCorrect);

        if (
          currentState.currentQuestionIndex <
          currentState.questions.length - 1
        ) {
          currentState.currentQuestionIndex += 1;
          renderTechQuestion(
            currentState.questions[currentState.currentQuestionIndex]
          );
        } else {
          showFinalMessage();
        }
      });

      answersContainerEl.append(answerEl);
    }
  });
}

const showFinalMessage = () => {
  // todo: change final message? add info

  gameMessageEl.innerHTML = `Quiz completed 🍭`;
  questionsNumberEl.textContent = 'COMPLETED';
  questionEl.classList.add('hide');
  answersContainerEl.textContent = '';
  containerEl.classList.add('container--final-message');
};

startGame();

playAgainBtnEl.addEventListener('click', () => {
  console.log('currentState.score', currentState.score);

  currentState.questions = [...initialState.questions];
  currentState.questionsNumber = initialState.questionsNumber;
  currentState.currentQuestionIndex = initialState.startQuestion;
  currentState.score = initialState.score;

  answersContainerEl.innerHTML = '';
  questionEl.innerHTML = '';
  questionEl.classList.add('hide');
  gameMessageEl.innerHTML = 'Choose the topics you want 🍬';
  gameScoreEl.textContent = '';

  startGame();
});
