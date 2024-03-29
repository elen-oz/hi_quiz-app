import {
  initialState,
  handleDifficultyClick,
  handleTechTopicClick,
} from './utils';

import {
  generalBtnEl,
  techBtnEl,
  informaticsBtnEl,
  playAgainBtnEl,
  gameScoreEl,
  questionEl,
  answersContainerEl,
  renderStartGame,
  renderGeneralQuestion,
  renderTechQuestion,
  removeEventListeners,
  containerDifficultyButtons,
  containerTechButtons,
  renderHeaderMessage,
} from './view';

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

const API_KEY: string = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';

export const getTechQuestions = async (topic: string): Promise<void> => {
  let url: string = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=${topic}&limit=${currentState.questionNumber}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();
  currentState.questions = data;

  renderTechQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
};

export const getInformaticsQuestions = async (
  difficulty: string
): Promise<void> => {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionNumber}&category=18&difficulty=${difficulty}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();
  currentState.questions = data.results;

  renderGeneralQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
};

export const getGeneralQuestions = async (
  difficulty: string
): Promise<void> => {
  let url = `https://opentdb.com/api.php?amount=${currentState.questionNumber}&category=9&difficulty=${difficulty}`;
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  let data = await response.json();
  currentState.questions = data.results;

  renderGeneralQuestion(
    currentState.questions[currentState.currentQuestionIndex],
    currentState
  );
};

const startGame: () => void = () => {
  removeEventListeners();
  renderStartGame();

  currentState.isFirstQuestion = true;
  currentState.gameState = initialState.gameState.start;

  renderHeaderMessage(currentState);

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
    if (
      localStorageState.gameType === 'general' ||
      localStorageState.gameType === 'informatics'
    ) {
      renderGeneralQuestion(localStorageQuestion, localStorageState);
      return;
    } else if (localStorageState.gameType === 'tech') {
      renderTechQuestion(localStorageQuestion, localStorageState);
      return;
    }
  }

  generalBtnEl.addEventListener('click', () => {
    currentState.gameType = 'general';
    handleDifficultyClick(currentState);
  });
  techBtnEl.addEventListener('click', () => {
    currentState.gameType = 'tech';
    handleTechTopicClick(currentState);
  });
  informaticsBtnEl.addEventListener('click', () => {
    currentState.gameType = 'informatics';
    handleDifficultyClick(currentState);
  });
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
  containerDifficultyButtons.remove();
  containerTechButtons.remove();
  questionEl.classList.add('hide');

  localStorage.clear();

  startGame();
});

startGame();
