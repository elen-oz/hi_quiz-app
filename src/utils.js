import { pickTechTopic, pickDifficulty } from './view.js';
import { getTechQuestions, getGeneralQuestions } from '../script.js';

export const initialState = {
  questions: [],
  questionsNumber: 10,
  startQuestion: 0,
  score: 0,
  isFirstQuestion: true,
};

export const handleDifficultyClick = () => pickDifficulty();
export const handleTechTopicClick = () => pickTechTopic();
export const handleEasyClick = () => getGeneralQuestions('easy');
export const handleMediumClick = () => getGeneralQuestions('medium');
export const handleHardClick = () => getGeneralQuestions('hard');

export const handleQuestionsHtmlClick = () => getTechQuestions('HTML');
export const handleQuestionsJavascriptClick = () =>
  getTechQuestions('JavaScript');

const emoji = {
  0: ['🎖️', '🥇', '💫', '🌟', '🏆', '💥', '🏅', '👑', '🥰', '🥳'],
  1: ['😊', '👌', '🤘', '🤟', '👍🏻', '🤌', '🤙🏼', '✌️', '😌'],
  2: ['😬', '🤔', '😖', '🥺', '🥴', '😵‍💫', '🤏🏻', '🦧'],
  3: ['💔', '😫', '😞', '😣', '😥', '😔', '😟', '😧', '🤧', '🥺'],
};

export function getRandomEmoji(key) {
  const emojiArray = emoji[key];
  const randomIndex = Math.floor(Math.random() * emojiArray.length);

  return emojiArray[randomIndex];
}

export const pickFinalEmoji = (result) => {
  if (result < 21) {
    return getRandomEmoji(3);
  } else if (result < 61) {
    return getRandomEmoji(2);
  } else if (result < 91) {
    return getRandomEmoji(1);
  } else {
    return generalBtnEl(0);
  }
};
