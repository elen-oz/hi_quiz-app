import {
  handleDifficultyClick,
  handleTechTopicClick,
  handleEasyClick,
  handleMediumClick,
  handleHardClick,
  handleQuestionsHtmlClick,
  handleQuestionsJavascriptClick,
} from './utils.js';

export const createElement = (tag, classNames, textContent) => {
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

wrapperEl.append(headerEl, mainEl, footerEl);
headerEl.append(playAgainBtnEl);
document.querySelector('#app').append(wrapperEl);

footerEl.innerHTML =
  '<a href="https://github.com/elen-oz/hi_quize-app/tree/elena" target="_blank">Source Code</a>';
questionsNumberEl.textContent = `Welcome! 🐟 Let's Start!`;
gameMessageEl.innerHTML = `Choose the topics you want 🍬`;

export const renderStartGame = () => {
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

export const renderPickDifficultyStage = () => {
  containerNewGameBtnEl.remove();

  gameMessageEl.innerHTML = `What level of difficulty? ⚔️`;

  gameBoardEl.append(containerDifficultyBtns);
  containerDifficultyBtns.append(easyBtnEl, mediumBtnEl, hardBtnEl);
};

export const renderPickTechTopicStage = () => {
  containerNewGameBtnEl.remove();

  gameBoardEl.append(containerTechBtns);
  containerTechBtns.append(htmlBtnEl, javascriptBtnEl);
};

export const renderMessageAndScore = (isTrue, score) => {
  if (isTrue) {
    gameMessageEl.innerHTML = `Correct! 🎯`;
    gameScoreEl.textContent = `Score: ${score}`;
  } else {
    gameMessageEl.innerHTML = `Nope 🦧`;
    gameScoreEl.textContent = `Score: ${score}`;
  }
};

export function renderGeneralQuestion(question, state) {
  containerDifficultyBtns.remove();
  containerNewGameBtnEl.remove();
  containerTechBtns.remove();
  answersContainerEl.innerHTML = '';

  questionsNumberEl.textContent = `${state.currentQuestionIndex + 1} / ${
    state.questionsNumber
  }`;

  questionEl.classList.remove('hide');
  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerEl = createElement('button', 'button button--answer', answer);

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
        showFinalMessage();
      }
    });

    answersContainerEl.append(answerEl);
  });
}

export const showFinalMessage = () => {
  // todo: change final message? add info

  gameMessageEl.innerHTML = `Quiz completed 🍭`;
  questionsNumberEl.textContent = 'COMPLETED';
  questionEl.classList.add('hide');
  answersContainerEl.textContent = '';
  containerEl.classList.add('container--final-message');
};

export function renderTechQuestion(question, state) {
  containerDifficultyBtns.remove();
  containerTechBtns.remove();
  containerNewGameBtnEl.remove();

  answersContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  questionsNumberEl.textContent = `${state.currentQuestionIndex + 1} / ${
    state.questionsNumber
  }`;

  questionEl.classList.remove('hide');
  questionEl.textContent = question.question;

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
          showFinalMessage();
        }
      });

      answersContainerEl.append(answerEl);
    }
  });
}

export function removeEventListeners() {
  generalBtnEl.addEventListener('click', handleDifficultyClick);
  techBtnEl.addEventListener('click', handleTechTopicClick);
  easyBtnEl.removeEventListener('click', handleEasyClick);
  mediumBtnEl.removeEventListener('click', handleMediumClick);
  hardBtnEl.removeEventListener('click', handleHardClick);
  htmlBtnEl.removeEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.removeEventListener('click', handleQuestionsJavascriptClick);
}

export const pickDifficulty = () => {
  // todo: LocalStorage
  renderPickDifficultyStage();
  removeEventListeners();

  easyBtnEl.addEventListener('click', handleEasyClick);
  mediumBtnEl.addEventListener('click', handleMediumClick);
  hardBtnEl.addEventListener('click', handleHardClick);
};

export const pickTechTopic = () => {
  // todo: LocalStorage
  renderPickTechTopicStage();
  removeEventListeners();

  htmlBtnEl.addEventListener('click', handleQuestionsHtmlClick);
  javascriptBtnEl.addEventListener('click', handleQuestionsJavascriptClick);
};
