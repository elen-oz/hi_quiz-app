'use strict';

let questions;
let questionsNumber = 10;
let currentQuestion = 0;
let rightAnswers = 0;

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

async function getQuestion() {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=9&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderQuestion(questions[currentQuestion]);
}

function renderQuestion(question) {
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
        renderQuestion(questions[currentQuestion]);
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

startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = 0;
  rightAnswers = 0;
  resultEl.textContent = '';

  getQuestion();
});
