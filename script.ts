import {
  initialState,
  handleDifficultyClick,
  handleTechTopicClick,
} from './src/utils';

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
} from './src/view';

const API_KEY: string = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

interface CurrentState {
  questions: any[];
  questionNumber: number;
  currentQuestionIndex: number;
  score: number;
  isFirstQuestion: boolean;
  gameState: string;
}

export const currentState: CurrentState = {
  questions: [...initialState.questions],
  questionNumber: initialState.questionNumber,
  currentQuestionIndex: initialState.startQuestion,
  score: initialState.score,
  isFirstQuestion: initialState.isFirstQuestion,
  gameState: initialState.gameState.start,
};

export async function getTechQuestions(topic: string): Promise<void> {
  let url: string = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${currentState.questionNumber}`;
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

export async function getGeneralQuestions(difficulty: string): Promise<void> {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionNumber}&category=9&difficulty=${difficulty}&type=multiple`;
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

const startGame: () => void = () => {
  removeEventListeners();
  renderStartGame();

  currentState.isFirstQuestion = true;
  currentState.gameState = initialState.gameState.start;

  getHeaderMessage(currentState);

  const localStorageTechQuestionString = localStorage.getItem('techQuestion');
  const localStorageTechQuestion =
    localStorageTechQuestionString !== null
      ? JSON.parse(localStorageTechQuestionString)
      : null;

  const localStorageTechStateString = localStorage.getItem('techState');
  const localStorageTechState =
    localStorageTechStateString !== null
      ? JSON.parse(localStorageTechStateString)
      : null;

  const localStorageGeneralQuestionString =
    localStorage.getItem('generalQuestion');
  const localStorageGeneralQuestion =
    localStorageGeneralQuestionString !== null
      ? JSON.parse(localStorageGeneralQuestionString)
      : null;

  const localStorageGeneralStateString = localStorage.getItem('generalState');
  const localStorageGeneralState =
    localStorageGeneralStateString !== null
      ? JSON.parse(localStorageGeneralStateString)
      : null;

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

  gameMessageEl.innerHTML = 'Choose the topics you want 🍬';

  startGame();
});

startGame();
