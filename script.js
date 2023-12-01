'use strict';

let questions;
let currentQuestion = 0;
let rightAnswers = 0;

let containerEl = document.querySelector('#container');

async function getQuestion() {
  let url = 'https://opentdb.com/api.php?amount=10&type=multiple';
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;

  renderQuestion(questions[currentQuestion]);
}

function renderQuestion(question) {
  containerEl.innerHTML = '';
  let correctAnswer = question.correct_answer;

  let questionEl = document.createElement('div');
  questionEl.innerHTML = question.question;
  containerEl.append(questionEl);

  console.log('correct answer', correctAnswer);

  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i];
    let answerEl = document.createElement('button');
    answerEl.innerHTML = answer;

    answerEl.addEventListener('click', function () {
      let currentAnswer = answerEl.innerHTML;
      if (currentAnswer === correctAnswer) {
        rightAnswers += 1;
        console.log('Right Answers: ' + rightAnswers);
        console.log('Correct!');
      } else {
        console.log('Not correct');
      }

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion(questions[currentQuestion]);
      } else {
        console.log('Quiz completed. Total right answers: ' + rightAnswers);
      }
    });

    containerEl.append(answerEl);
  }
}

getQuestion();
