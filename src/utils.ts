import { pickTechTopic, pickDifficulty } from './view';
import { getTechQuestions, getGeneralQuestions } from '../script';

interface GameState {
  start: string;
  progress: string;
  end: string;
}
interface InitialState {
  questions: any[];
  questionNumber: number;
  startQuestion: number;
  score: number;
  isFirstQuestion: boolean;
  gameState: GameState;
}
export const initialState: InitialState = {
  questions: [],
  questionNumber: 10,
  startQuestion: 0,
  score: 0,
  isFirstQuestion: true,
  gameState: {
    start: 'start',
    progress: 'progress',
    end: 'end',
  },
};

export const handleDifficultyClick = (): void => pickDifficulty();
export const handleTechTopicClick = (): void => pickTechTopic();
export const handleEasyClick = (): Promise<void> => getGeneralQuestions('easy');
export const handleMediumClick = (): Promise<void> =>
  getGeneralQuestions('medium');
export const handleHardClick = (): Promise<void> => getGeneralQuestions('hard');

export const handleQuestionsHtmlClick = (): Promise<void> =>
  getTechQuestions('HTML');
export const handleQuestionsJavascriptClick = (): Promise<void> =>
  getTechQuestions('JavaScript');

type Emoji = { [key: number]: string[] };

const emoji: Emoji = {
  0: ['🎖️', '🥇', '💫', '🌟', '🏆', '💥', '🏅', '👑', '🥰', '🥳'],
  1: ['😊', '👌', '🤘', '🤟', '👍🏻', '🤌', '🤙🏼', '✌️', '😌'],
  2: ['😬', '🤔', '😖', '🥺', '🥴', '😵‍💫', '🤏🏻', '🦧'],
  3: ['💔', '😫', '😞', '😣', '😥', '😔', '😟', '😧', '🤧', '🥺'],
};

export function getRandomEmoji(key: number): string {
  const emojiArray = emoji[key];
  const randomIndex = Math.floor(Math.random() * emojiArray.length);

  return emojiArray[randomIndex];
}

export const pickFinalEmoji = (result: number): string => {
  if (result < 21) {
    return getRandomEmoji(3);
  } else if (result < 61) {
    return getRandomEmoji(2);
  } else if (result < 91) {
    return getRandomEmoji(1);
  } else {
    return getRandomEmoji(0);
  }
};
