// import { closeSignThomasBeautifulEl } from './view';
import {
  handleDifficultyClick,
  handleTechTopicClick,
  handleEasyClick,
  handleMediumClick,
  handleHardClick,
  handleQuestionsHtmlClick,
  handleQuestionsJavascriptClick,
  getRandomEmoji,
  pickFinalEmoji,
  initialState,
} from './utils';

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

interface State {
  questions: any[];
  questionNumber: number;
  currentQuestionIndex: number;
  score: number;
  isFirstQuestion: boolean;
  gameState: string;
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
export const techBtnEl = createElement('button', 'button', 'Tech Questions');
export const containerDifficultyBtns = createElement(
  'div',
  'container-buttons-selection'
);
export const easyBtnEl = createElement('button', 'button', 'Easy Peasy');
export const mediumBtnEl = createElement('button', 'button', 'Medium');
export const hardBtnEl = createElement('button', 'button', 'Hard');
export const containerTechBtns = createElement(
  'div',
  'container-buttons-selection'
);
export const htmlBtnEl = createElement('button', 'button button-tech', 'HTML');
export const javascriptBtnEl = createElement(
  'button',
  'button button-tech',
  'JavaScript'
);
// ! ---------------------  create THOMAS ------------------------
const thomasOnSideContainerEl = createElement(
  'div',
  'container-thomas container-thomas-on-side animate__animated animate__rollIn'
);

const thomasOnSideEl = createElement('div', 'image image-thomas-on-side');

export const closeSignThomasOnSideEl = createElement('button', 'close-sign');
closeSignThomasOnSideEl.textContent = 'X';
closeSignThomasOnSideEl.title = 'Shoo!';
// -----------------------------------------
const thomasAboveContainerEl = createElement(
  'div',
  'container-thomas container-thomas-above animate__animated animate__fadeInRight'
);
const thomasAboveEl = createElement('div', 'image image-thomas-above');

export const closeSignThomasAboveEl = createElement('button', 'close-sign');
closeSignThomasAboveEl.textContent = 'X';
closeSignThomasAboveEl.title = 'Shoo!';

// -----------------------------------------
const thomasSleepingContainerEl = createElement(
  'div',
  'container-thomas container-sleeping-thomas animate__animated animate__fadeInRight'
);
const thomasSleepingEl = createElement('div', 'image image-thomas-sleeping');

export const closeSignThomasSleepingEl = createElement('button', 'close-sign');
closeSignThomasSleepingEl.textContent = 'X';
closeSignThomasSleepingEl.title = 'Shoo!';

// -----------------------------------------
// image-beautiful-thomas
const thomasBeautifulContainerEl = createElement(
  'div',
  'container-thomas container-beautiful-thomas animate__animated animate__fadeInRight'
);
const thomasBeautifulEl = createElement('div', 'image image-beautiful-thomas');

export const closeSignThomasBeautifulEl = createElement('button', 'close-sign');
closeSignThomasBeautifulEl.textContent = 'X';
closeSignThomasBeautifulEl.title = 'Shoo!';

// -----------------------------------------

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

export const getHeaderMessage = (state: State): void => {
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
  containerNewGameBtnEl.append(generalBtnEl, techBtnEl);
};

export const renderPickDifficultyStage = (): void => {
  containerNewGameBtnEl.remove();

  gameMessageEl.innerHTML = `What level of difficulty? ⚔️`;

  gameBoardEl.append(containerDifficultyBtns);
  containerDifficultyBtns.append(easyBtnEl, mediumBtnEl, hardBtnEl);
};

export const renderPickTechTopicStage = (): void => {
  containerNewGameBtnEl.remove();

  gameBoardEl.append(containerTechBtns);
  containerTechBtns.append(htmlBtnEl, javascriptBtnEl);
};

export function removeEventListeners(): void {
  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
  easyBtnEl.removeEventListener('click', handleEasyClick);
  mediumBtnEl.removeEventListener('click', handleMediumClick);
  hardBtnEl.removeEventListener('click', handleHardClick);
  htmlBtnEl.removeEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.removeEventListener('click', handleQuestionsJavascriptClick);
}

export const pickDifficulty = (): void => {
  renderPickDifficultyStage();
  removeEventListeners();

  easyBtnEl.addEventListener('click', handleEasyClick);
  mediumBtnEl.addEventListener('click', handleMediumClick);
  hardBtnEl.addEventListener('click', handleHardClick);
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
  getHeaderMessage(state);

  const result = (state.score / state.questionNumber) * 100;
  gameMessageEl.innerHTML = `Quiz completed 🍭`;
  questionEl.innerHTML = `You answered ${result}% of the questions correctly.<br>${pickFinalEmoji(
    result
  )}`;

  answersContainerEl.textContent = '';
};
// ! ---------------- show THOMAS ------------------
export const showThomas = () => {
  containerEl.append(thomasOnSideContainerEl);
  thomasOnSideContainerEl.append(thomasOnSideEl);
  thomasOnSideContainerEl.append(closeSignThomasOnSideEl);

  containerEl.append(thomasAboveContainerEl);
  thomasAboveContainerEl.append(thomasAboveEl);
  thomasAboveContainerEl.append(closeSignThomasAboveEl);

  containerEl.append(thomasSleepingContainerEl);
  thomasSleepingContainerEl.append(thomasSleepingEl);
  thomasSleepingContainerEl.append(closeSignThomasSleepingEl);

  containerEl.append(thomasBeautifulContainerEl);
  thomasBeautifulContainerEl.append(thomasBeautifulEl);
  thomasBeautifulContainerEl.append(closeSignThomasBeautifulEl);
};

export const removeThomasOnSide = () => {
  closeSignThomasOnSideEl.remove();
  thomasOnSideEl.remove();
};

const renderQuestion = (question: any, state: State) => {
  containerDifficultyBtns.remove();
  containerNewGameBtnEl.remove();
  containerTechBtns.remove();
  answersContainerEl.innerHTML = '';
  state.gameState = initialState.gameState.progress;

  if (state.isFirstQuestion) {
    gameMessageEl.innerHTML = `Let's play 🎲`;
    state.isFirstQuestion = false;
  }

  getHeaderMessage(state);

  questionEl.classList.remove('hide');
  questionEl.innerHTML = question.question;
};

export function renderGeneralQuestion(
  question: QuestionGeneral,
  state: State
): void {
  localStorage.setItem('question', JSON.stringify(question));
  localStorage.setItem('state', JSON.stringify(state));

  renderQuestion(question, state);

  let correctAnswer = question.correct_answer;
  // let answers = question.incorrect_answers.concat([question.correct_answer]);
  let answers = [
    ...(question.incorrect_answers || []),
    question.correct_answer,
  ].filter(Boolean);

  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button button--answer');
    answerEl.innerHTML = answer;

    answerEl.addEventListener('click', function () {
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
}

export function renderTechQuestion(question: QuestionTech, state: State): void {
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

      answerEl.addEventListener('click', function () {
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
          showFinalMessage(state);
        }
      });

      answersContainerEl.append(answerEl);
    }
  });
}
