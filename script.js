'use strict';
import {
  initialState,
  handleDifficultyClick,
  handleTechTopicClick,
  handleEasyClick,
  handleMediumClick,
  handleHardClick,
  handleQuestionsHtmlClick,
  handleQuestionsJavascriptClick,
} from './src/utils.js';

import {
  generalBtnEl,
  techBtnEl,
  easyBtnEl,
  mediumBtnEl,
  hardBtnEl,
  htmlBtnEl,
  playAgainBtnEl,
  gameMessageEl,
  gameScoreEl,
  questionEl,
  answersContainerEl,
  javascriptBtnEl,
  renderStartGame,
  renderGeneralQuestion,
  renderTechQuestion,
  removeEventListeners,
} from './src/view.js';

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

const currentState = {
  questions: [...initialState.questions],
  questionsNumber: initialState.questionsNumber,
  currentQuestionIndex: initialState.startQuestion,
  score: initialState.score,
};

export async function getTechQuestions(topic) {
  let url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${currentState.questionsNumber}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data;
  console.log(currentState.questions);

  renderTechQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
}

export async function getGeneralQuestions(difficulty) {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionsNumber}&category=9&difficulty=${difficulty}&type=multiple`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data.results;
  console.log(currentState.questions);

  renderGeneralQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
}

const startGame = () => {
  removeEventListeners();
  renderStartGame();

  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
};

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

startGame();
