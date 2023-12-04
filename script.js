'use strict';

let questions;
let techQuestions;
let questionsNumber = 10;
let currentQuestion = 0;
let rightAnswers = 0;

const API_KEY = 'Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980';
// const apiTags = {
//   HTML: HTML,
//   JavaScript: JavaScript,
// };

// https://quizapi.io/api/v1/questions?apiKey=Xk2hwwlJjoNOx1FcB9vjjswxmOuaw0DHJ43QN980&tags=JavaScript

let appEl = document.querySelector('#app');

let containerEl = document.createElement('div');
containerEl.setAttribute('id', 'container');
containerEl.classList.add('container');
appEl.append(containerEl);

let startAgainBtnEl = document.createElement('button');
startAgainBtnEl.classList.add('button', 'button--again');
startAgainBtnEl.textContent = 'Start';
containerEl.prepend(startAgainBtnEl);

let questionsNumberEl = document.createElement('h2');
questionsNumberEl.classList.add('questions-number');

let questionEl = document.createElement('div');
questionEl.classList.add('question');
containerEl.append(questionEl);

let buttonContainerEl = document.createElement('div');
buttonContainerEl.classList.add('button-container');
containerEl.append(buttonContainerEl);

let resultEl = document.createElement('div');
resultEl.classList.add('result');
containerEl.append(resultEl);

async function getTechQuestions() {
  let url = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&tags=JavaScript&limit=${questionsNumber}`;
  let response = await fetch(url);
  let data = await response.json();

  techQuestions = data;
  console.log(techQuestions);

  renderTechQuestion(techQuestions[currentQuestion]);
}

async function getGeneralQuestions() {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=9&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderGeneralQuestion(questions[currentQuestion]);
}

function renderGeneralQuestion(question) {
  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  startAgainBtnEl.textContent = 'Start Again';
  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);
  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    let answerEl = document.createElement('button');
    answerEl.innerHTML = answer;
    answerEl.classList.add('button');
    answerEl.addEventListener('click', function () {
      let currentAnswer = answerEl.innerHTML;

      if (currentAnswer === correctAnswer) {
        rightAnswers += 1;
        console.log('! Right Answers: ' + rightAnswers);
        console.log('=> Correct!');
      } else {
        console.log('=> Not correct');
      }

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderGeneralQuestion(questions[currentQuestion]);
      } else {
        resultEl.textContent = `Quiz completed. Total right answers: ${rightAnswers}`;

        questionsNumberEl.innerHTML = 'FINISH';

        questionEl.innerHTML = '';
        buttonContainerEl.innerHTML = '';
      }
    });

    buttonContainerEl.append(answerEl);
  });
}

function renderTechQuestion(question) {
  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  startAgainBtnEl.textContent = 'Start Again';
  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);
  questionEl.textContent = question.question;

  let answers = question.answers;
  let correctAnswers = question.correct_answers;

  Object.keys(answers).forEach((key) => {
    if (answers[key] !== null) {
      let answerEl = document.createElement('button');
      answerEl.textContent = answers[key];
      answerEl.classList.add('button');

      answerEl.addEventListener('click', function () {
        let isCorrect = correctAnswers[key + '_correct'] === 'true';

        if (isCorrect) {
          rightAnswers += 1;
          console.log('=> Correct!');
        } else {
          console.log('=> Not correct');
        }

        if (currentQuestion < techQuestions.length - 1) {
          currentQuestion += 1;
          renderTechQuestion(techQuestions[currentQuestion]);
        } else {
          resultEl.textContent = `Quiz completed. Total right answers: ${rightAnswers}`;
          questionsNumberEl.textContent = 'FINISH';
          questionEl.textContent = '';
          buttonContainerEl.textContent = '';
        }
      });

      buttonContainerEl.append(answerEl);
    }
  });
}

startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = 0;
  rightAnswers = 0;
  resultEl.textContent = '';

  //   getGeneralQuestions();
  getTechQuestions();
});
