"use strict";
let questions;
let contanerEl = document.querySelector("#contaner");

async function getQuestion() {
  let url = "https://opentdb.com/api.php?amount=10&type=multiple";
  let response = await fetch(url);
  let data = await response.json();

  questions = data;
  console.log(questions);
  let questionEL = document.createElement("div");

  questionEL.innerHTML = questions;
}

getQuestion();
