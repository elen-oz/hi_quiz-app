'use strict';

// Declare variables to store quiz data and state.
let questions;
let questionsNumber = 10;
let currentQuestion = 0;
let rightAnswers = 0;
let contributors = ['Elena', 'Osman', 'Jordan'];

// create "history" variable for storage data of results
let history;

// here we getting data from localStorage.
let dataFromLocalStorage = localStorage.getItem('history');

// checking if there any information inside localStorage
if (dataFromLocalStorage) {
  // if there is, then we need "parse" it:
  history = JSON.parse(dataFromLocalStorage);
} else {
  // if there isn't, then just give empty array to this variable
  history = [];
}

// Find the HTML element with the ID 'app' to use it in the script.
let appEl = document.querySelector('#app');

// Create a new 'div' element for the container and add it to the 'app' element.
let containerEl = document.createElement('div');
// containerEl.setAttribute('id', 'container');
containerEl.classList.add('container');
appEl.append(containerEl);

// create a new 'div' for history
let historyEl = document.createElement('div');
// add class to the element
historyEl.classList.add('history');
// historyEl.textContent = 'Previous Results:';
containerEl.append(historyEl);

// call a function, that displays previous results
displayHistory();

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
  let url = `https://opentdb.com/api.php?amount=${questionsNumber}&category=26`;
  let response = await fetch(url);
  let data = await response.json();

  questions = data.results;


  renderQuestion(questions[currentQuestion]);
}

// displays a question and its answers.
function renderQuestion(question) {
  // adding our history element to container of the game
  containerEl.append(historyEl);
  buttonContainerEl.innerHTML = '';
  questionsNumberEl.innerHTML = '';

  startAgainBtnEl.textContent = 'Start Again';

  questionsNumberEl.textContent = `${currentQuestion + 1} / ${questionsNumber}`;
  containerEl.prepend(questionsNumberEl);

  questionEl.innerHTML = question.question;

  let correctAnswer = question.correct_answer;
 

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
      }

      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion(questions[currentQuestion]);
      } else {


        //this is the last part of the function if the question is the last one.
        // add to the end of "history" array new result
        history[history.length] = rightAnswers;

        // add history to localStorage
        localStorage.setItem('history', JSON.stringify(history));
        displayHistory();

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

// this function display history
function displayHistory() {
  // 1) first we need to check if there was any result or it's first game
  // if length of array is 0, it's mean that there wasn't game before (localStorage is empty) so we display just line: 'Let's Start'
  if (history.length === 0) {
    historyEl.innerHTML = `Let's Start!`;
  } else {
    // 2) otherwise there were some results and we need to display them instead
    // we add litle title for the list:
    historyEl.innerHTML = 'Previous Results:';

    // here is a loop, where we display each element of array one by one
    for (let i = 0; i < history.length; i += 1) {
      // create <div> element
      let scoreEl = document.createElement('div');
      // add each element as text inside the tag
      scoreEl.innerHTML = history[i];
      // add this element to parent element which is historyEl
      historyEl.appendChild(scoreEl);
    }
  }
}

// Add a click event to the 'start again' button to reset the quiz and fetch new questions.
startAgainBtnEl.addEventListener('click', () => {
  currentQuestion = 0;
  rightAnswers = 0;
  resultEl.textContent = '';

  getQuestion();
});

// You can add 1 more button - to delete localStorage and clean results
