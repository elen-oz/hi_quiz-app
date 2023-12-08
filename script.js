'use strict';

// Declare variables to store quiz data and state.
let questions;
let questionsNumber = 10;
let currentQuestion = 0;
let rightAnswers = 0;
let contributors = ['Elena', 'Osman', 'Jordan'];

// Find the HTML element with the ID 'app' to use it in the script.
let appEl = document.querySelector('#app');

// Create a new 'div' element for the container and add it to the 'app' element.
let containerEl = document.createElement('div');
// containerEl.setAttribute('id', 'container');
containerEl.classList.add('container');
appEl.append(containerEl);

// footer
let footerEl = document.createElement('footer');
footerEl.classList.add('footer');
footerEl.textContent = `${contributors.join(' | ')}`;
appEl.append(footerEl);

// Create a button to start the quiz again and add it to the container.
let startAgainBtnEl = document.createElement('button');
startAgainBtnEl.classList.add('button', 'button--again');
startAgainBtnEl.textContent = 'Start';
containerEl.prepend(startAgainBtnEl);

// Create elements to display the number of questions
let questionsNumberEl = document.createElement('h2');
questionsNumberEl.classList.add('questions-number');

// Create elements to display the question itself
let questionEl = document.createElement('div');
questionEl.classList.add('question');
containerEl.append(questionEl);

// Create elements to display container where buttons for answers will be appear
let buttonContainerEl = document.createElement('div');
buttonContainerEl.classList.add('button-container');
containerEl.append(buttonContainerEl);

// Create elements to display the result.
let resultEl = document.createElement('div');
resultEl.classList.add('result');
containerEl.append(resultEl);

// questions from an API and display the first question.
async function getQuestion() {
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=26&type=multiple`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;
  console.log(questions);

  renderQuestion(questions[currentQuestion]);
}

// displays a question and its answers.
function renderQuestion(question) {
  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  startAgainBtnEl.textContent = 'Start Again';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);

  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
  console.log('---hint: ', correctAnswer);

  let answers = question.incorrect_answers.concat([question.correct_answer]);
  answers = answers.sort(() => 0.5 - Math.random());

  // Create buttons for each answer and add a click event to check the answer.
  for (let i = 0; i < answers.length; i++) {
    let answer = answers[i];
    let answerEl = document.createElement('button');
    answerEl.innerHTML = answer;
    answerEl.classList.add('button');
    answerEl.addEventListener('click', function () {
      let currentAnswer = answerEl.innerHTML;

      // Go to the next question or end the quiz if all questions are answered.
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

        // remove unnecessary fields
        questionEl.innerHTML = '';
        buttonContainerEl.innerHTML = '';
      }
    });

    buttonContainerEl.append(answerEl);
  }
}

// Add a click event to the 'start again' button to reset the quiz and fetch new questions.
startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = 0;
  rightAnswers = 0;
  resultEl.textContent = '';

  getQuestion();
});
