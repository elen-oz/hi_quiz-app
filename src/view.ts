import {
  handleDifficultyClick,
  handleTechTopicClick,
  handleQuestionsHtmlClick,
  handleQuestionsJavascriptClick,
  getRandomEmoji,
  pickFinalEmoji,
  initialState,
  handleQuestionSelection,
} from './utils';

import { currentState } from './main';

interface QuestionGeneral {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}
interface QuestionTech {
  answers: any;
  category: string;
  correct_answer: string;
  correct_answers: any;
  question: string;
}

export interface State {
  questions: any[];
  questionNumber: number;
  currentQuestionIndex: number;
  score: number;
  isFirstQuestion: boolean;
  gameState: string;
  gameType: string;
}

export const createElement = (
  tag: string,
  classNames?: string,
  textContent?: string
): HTMLElement => {
  const element = document.createElement(tag);
  if (classNames) {
    element.classList.add(...classNames.split(' '));
  }
  element.textContent = textContent !== undefined ? textContent : '';
  return element;
};

export const wrapperEl = createElement('div', 'wrapper');
export const headerEl = createElement('header', 'header');
export const mainEl = createElement('main', 'main');
export const playAgainBtnEl = createElement(
  'button',
  'button button--again',
  'Restart'
);
export const footerEl = createElement('footer', 'footer');
export const containerEl = createElement('div', 'container');
export const gameMessageEl = createElement('div', 'game-message');
export const gameScoreEl = createElement('div', 'game-score');
export const gameBoardEl = createElement('div', 'game-board');
export const questionsNumberEl = createElement('h2', 'questions-number');
export const questionEl = createElement('div', 'question hide');
export const answersContainerEl = createElement('div', 'answers-container');
export const containerNewGameBtnEl = createElement(
  'div',
  'container-buttons-selection'
);
export const generalBtnEl = createElement(
  'button',
  'button',
  'General Questions'
);
export const techBtnEl = createElement(
  'button',
  'button',
  'Frontend Questions'
);
export const informaticsBtnEl = createElement(
  'button',
  'button',
  'Computer Science'
);

export const containerDifficultyButtons = createElement(
  'div',
  'container-buttons-selection'
);
export const easyBtnEl = createElement('button', 'button', 'Easy Peasy');
export const mediumBtnEl = createElement('button', 'button', 'Medium');
export const hardBtnEl = createElement('button', 'button', 'Hard');
export const containerTechButtons = createElement(
  'div',
  'container-buttons-selection'
);
export const htmlBtnEl = createElement('button', 'button button-tech', 'HTML');
export const javascriptBtnEl = createElement(
  'button',
  'button button-tech',
  'JavaScript'
);

const appEl = document.querySelector('#app');

if (appEl) {
  appEl.classList.add('animated-gradient');
  appEl.append(wrapperEl);
} else {
  console.error('#app element not found');
}

wrapperEl.append(headerEl, mainEl, footerEl);
headerEl.append(playAgainBtnEl);

footerEl.innerHTML =
  '<a href="https://github.com/elen-oz/hi_quize-app/tree/elena" target="_blank">Source Code</a>';

export const renderHeaderMessage = (state: State): void => {
  switch (state.gameState) {
    case 'start':
      questionsNumberEl.textContent = `🐟 Ready for some fun? 🐟`;
      gameMessageEl.innerHTML = `🎲 Let's play! 🎲`;
      break;
    case 'progress':
      questionsNumberEl.innerHTML = `${state.currentQuestionIndex + 1} / ${
        state.questionNumber
      }`;
      break;
    case 'end':
      questionsNumberEl.textContent = 'COMPLETED';
      break;
    default:
      return;
  }
};

export const renderStartGame = (): void => {
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
  containerNewGameBtnEl.append(generalBtnEl, techBtnEl, informaticsBtnEl);
};

export const renderPickDifficultyStage = (): void => {
  containerNewGameBtnEl.remove();

  gameMessageEl.innerHTML = `What level of difficulty? ⚔️`;
  gameBoardEl.append(containerDifficultyButtons);
  containerDifficultyButtons.append(easyBtnEl, mediumBtnEl, hardBtnEl);
};

export const renderPickTechTopicStage = (): void => {
  containerNewGameBtnEl.remove();

  gameMessageEl.innerHTML = `What topic? 🥁`;
  gameBoardEl.append(containerTechButtons);
  containerTechButtons.append(htmlBtnEl, javascriptBtnEl);
};

export const removeEventListeners = (): void => {
  generalBtnEl.addEventListener('click', (e) => {
    handleDifficultyClick(currentState);
  });
  techBtnEl.addEventListener('click', (e) => {
    handleTechTopicClick(currentState);
  });
  informaticsBtnEl.addEventListener('click', (e) => {
    handleDifficultyClick(currentState);
  });
  easyBtnEl.removeEventListener('click', (e) => {
    handleQuestionSelection(currentState, 'easy');
  });
  mediumBtnEl.removeEventListener('click', (e) => {
    handleQuestionSelection(currentState, 'medium');
  });
  hardBtnEl.removeEventListener('click', (e) => {
    handleQuestionSelection(currentState, 'hard');
  });
  htmlBtnEl.removeEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.removeEventListener('click', handleQuestionsJavascriptClick);
};

export const pickDifficulty = (state: State): void => {
  renderPickDifficultyStage();
  removeEventListeners();

  easyBtnEl.addEventListener('click', () => {
    handleQuestionSelection(state, 'easy');
  });
  mediumBtnEl.addEventListener('click', () => {
    handleQuestionSelection(state, 'medium');
  });
  hardBtnEl.addEventListener('click', () => {
    handleQuestionSelection(state, 'hard');
  });
};

export const pickTechTopic = (): void => {
  renderPickTechTopicStage();
  removeEventListeners();

  htmlBtnEl.addEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.addEventListener('click', handleQuestionsJavascriptClick);
};

export const renderMessageAndScore = (isTrue: boolean, score: number): void => {
  if (isTrue) {
    gameMessageEl.innerHTML = `Correct! ${getRandomEmoji(1)}`;
    gameScoreEl.textContent = `Score: ${score}`;
  } else {
    gameMessageEl.innerHTML = `Nope ${getRandomEmoji(2)}`;
    gameScoreEl.textContent = `Score: ${score}`;
  }
};

export const showFinalMessage = (state: State): void => {
  renderHeaderMessage(state);

  const result = (state.score / state.questionNumber) * 100;
  gameMessageEl.innerHTML = `Quiz completed 🍭`;
  questionEl.innerHTML = `You answered ${result}% of the questions correctly.<br>${pickFinalEmoji(
    result
  )}`;

  answersContainerEl.textContent = '';
};

const renderQuestion = (question: any, state: State) => {
  containerDifficultyButtons.remove();
  containerNewGameBtnEl.remove();
  containerTechButtons.remove();
  answersContainerEl.innerHTML = '';
  state.gameState = initialState.gameState.progress;

  if (state.isFirstQuestion) {
    gameMessageEl.innerHTML = `Let's play 🎲`;
    state.isFirstQuestion = false;
  }

  renderHeaderMessage(state);

  questionEl.classList.remove('hide');

  if (state.gameType === 'tech') {
    questionEl.textContent = question.question;
  } else {
    questionEl.innerHTML = question.question;
  }
};

export const renderGeneralQuestion = (
  question: QuestionGeneral,
  state: State
): void => {
  localStorage.setItem('question', JSON.stringify(question));
  localStorage.setItem('state', JSON.stringify(state));

  renderQuestion(question, state);

  let correctAnswer = question.correct_answer;
  let answers = [
    ...(question.incorrect_answers || []),
    question.correct_answer,
  ].filter(Boolean);

  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button button--answer');
    answerEl.innerHTML = answer;

    answerEl.addEventListener('click', () => {
      let isCorrect = answer === correctAnswer;

      isCorrect && state.score++;
      renderMessageAndScore(isCorrect, state.score);

      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        renderGeneralQuestion(
          state.questions[state.currentQuestionIndex],
          state
        );
      } else {
        state.gameState = initialState.gameState.end;
        showFinalMessage(state);
      }
    });

    answersContainerEl.append(answerEl);
  });
};

export const renderTechQuestion = (
  question: QuestionTech,
  state: State
): void => {
  localStorage.removeItem('generalQuestion');
  localStorage.removeItem('generalState');

  localStorage.setItem('question', JSON.stringify(question));
  localStorage.setItem('state', JSON.stringify(state));

  renderQuestion(question, state);

  let answers = question.answers;
  let correctAnswers = question.correct_answers;

  Object.keys(answers).forEach((key) => {
    if (answers[key] !== null) {
      let answerEl = document.createElement('button');
      answerEl.textContent = answers[key];
      answerEl.classList.add('button', 'button--answer');

      answerEl.addEventListener('click', () => {
        let isCorrect = correctAnswers[key + '_correct'] === 'true';

        isCorrect && state.score++;
        renderMessageAndScore(isCorrect, state.score);

        if (state.currentQuestionIndex < state.questions.length - 1) {
          state.currentQuestionIndex += 1;
          renderTechQuestion(
            state.questions[state.currentQuestionIndex],
            state
          );
        } else {
          state.gameState = initialState.gameState.end;
          showFinalMessage(state);
        }
      });

      answersContainerEl.append(answerEl);
    }
  });
};
