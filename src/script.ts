import {
  initialState,
  handleDifficultyClick,
  handleTechTopicClick,
} from './utils';

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
  showThomas,
  closeSignThomasOnSideEl,
  removeThomasOnSide,
} from './view';

const API_KEY: string = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

interface CurrentState {
  questions: any[];
  questionNumber: number;
  currentQuestionIndex: number;
  score: number;
  isFirstQuestion: boolean;
  gameState: string;
  gameType: string;
}

export const currentState: CurrentState = {
  questions: [...initialState.questions],
  questionNumber: initialState.questionNumber,
  currentQuestionIndex: initialState.startQuestion,
  score: initialState.score,
  isFirstQuestion: initialState.isFirstQuestion,
  gameState: initialState.gameState.start,
  gameType: '',
};

export async function getTechQuestions(topic: string): Promise<void> {
  let url: string = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${currentState.questionNumber}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data;
  currentState.gameType = 'tech';

  renderTechQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
}

export async function getGeneralQuestions(difficulty: string): Promise<void> {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionNumber}&category=9&difficulty=${difficulty}&type=multiple`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();

  currentState.questions = data.results;
  currentState.gameType = 'general';

  renderGeneralQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
}

const startGame: () => void = () => {
  removeEventListeners();
  renderStartGame();

  currentState.isFirstQuestion = true;
  currentState.gameState = initialState.gameState.start;

  getHeaderMessage(currentState);

  const localStorageQuestionString = localStorage.getItem('question');

  const localStorageQuestion =
    localStorageQuestionString !== null
      ? JSON.parse(localStorageQuestionString)
      : null;

  const localStorageStateString = localStorage.getItem('state');

  const localStorageState =
    localStorageStateString !== null
      ? JSON.parse(localStorageStateString)
      : null;

  if (localStorageQuestion && localStorageState) {
    if (localStorageState.gameType === 'general') {
      renderGeneralQuestion(localStorageQuestion, localStorageState);
      return;
    } else if (localStorageState.gameType === 'tech') {
      renderTechQuestion(localStorageQuestion, localStorageState);
      return;
    }
  }

  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
};

playAgainBtnEl.addEventListener('click', () => {
  currentState.questions = [...initialState.questions];
  currentState.questionNumber = initialState.questionNumber;
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

  startGame();
});

closeSignThomasOnSideEl.addEventListener('click', removeThomasOnSide);

showThomas();

startGame();
