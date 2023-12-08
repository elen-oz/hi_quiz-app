'use strict';

import {
  initialState,
  handleDifficultyClick,
  handleTechTopicClick,
} from './src/utils.js';

import {
  generalBtnEl,
  techBtnEl,
  playAgainBtnEl,
  gameMessageEl,
  gameScoreEl,
  questionEl,
  answersContainerEl,
  renderStartGame,
  renderGeneralQuestion,
  renderTechQuestion,
  removeEventListeners,
  containerDifficultyBtns,
  containerTechBtns,
  getHeaderMessage,
} from './src/view.js';

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

export const currentState = {
  questions: [...initialState.questions],
  questionsNumber: initialState.questionsNumber,
  currentQuestionIndex: initialState.startQuestion,
  score: initialState.score,
  isFirstQuestion: initialState.isFirstQuestion,
  gameState: initialState.gameState.start,
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

  currentState.isFirstQuestion = true;
  currentState.gameState = initialState.gameState.start;

  getHeaderMessage(currentState);

  const localStorageTechQuestion = JSON.parse(
    localStorage.getItem('techQuestion')
  );
  const localStorageTechState = JSON.parse(localStorage.getItem('techState'));

  const localStorageGeneralQuestion = JSON.parse(
    localStorage.getItem('generalQuestion')
  );
  const localStorageGeneralState = JSON.parse(
    localStorage.getItem('generalState')
  );

  if (localStorageTechQuestion && localStorageTechState) {
    renderTechQuestion(localStorageTechQuestion, localStorageTechState);
    return;
  } else if (localStorageGeneralQuestion && localStorageGeneralState) {
    renderGeneralQuestion(
      localStorageGeneralQuestion,
      localStorageGeneralState
    );
    return;
  }

  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
};

playAgainBtnEl.addEventListener('click', () => {
  currentState.questions = [...initialState.questions];
  currentState.questionsNumber = initialState.questionsNumber;
  currentState.currentQuestionIndex = initialState.startQuestion;
  currentState.score = initialState.score;
  currentState.isFirstQuestion = true;
  currentState.gameState = initialState.gameState.start;

  answersContainerEl.innerHTML = '';
  questionEl.innerHTML = '';
  gameScoreEl.textContent = '';
  containerDifficultyBtns.remove();
  containerTechBtns.remove();
  questionEl.classList.add('hide');

  localStorage.clear();

  gameMessageEl.innerHTML = 'Choose the topics you want 🍬';

  startGame();
});

startGame();
