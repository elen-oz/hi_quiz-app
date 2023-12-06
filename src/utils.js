import { pickTechTopic, pickDifficulty } from './view.js';
import { getTechQuestions, getGeneralQuestions } from '../script.js';

export const initialState = {
  questions: [],
  questionsNumber: 10,
  startQuestion: 0,
  score: 0,
};

export const handleDifficultyClick = () => pickDifficulty();
export const handleTechTopicClick = () => pickTechTopic();
export const handleEasyClick = () => getGeneralQuestions('easy');
export const handleMediumClick = () => getGeneralQuestions('medium');
export const handleHardClick = () => getGeneralQuestions('hard');

export const handleQuestionsHtmlClick = () => getTechQuestions('HTML');
export const handleQuestionsJavascriptClick = () =>
  getTechQuestions('JavaScript');
