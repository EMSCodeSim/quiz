// script.js

document.addEventListener("DOMContentLoaded", function () {
  const quizContainer = document.getElementById("quiz");
  const submitButton = document.getElementById("submit");
  const resultsContainer = document.getElementById("results");

  fetch("ems_quiz_test.json")
    .then((response) => response.json())
    .then((data) => {
      const questions = getRandomQuestions(data, 5);
      buildQuiz(questions);

      submitButton.addEventListener("click", function () {
        showResults(questions);
      });
    })
    .catch((error) => {
      quizContainer.innerHTML = "<p>Error loading quiz. Please try again later.</p>";
      console.error("Error:", error);
    });

  function getRandomQuestions(data, count) {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function buildQuiz(questions) {
    const output = [];

    questions.forEach((q, index) => {
      const answers = [];

      for (let letter in q.answers) {
        answers.push(
          `<label>
             <input type="radio" name="question${index}" value="${letter}">
             ${letter}: ${q.answers[letter]}
           </label>`
        );
      }

      output.push(
        `<div class="question">${index + 1}. ${q.question}</div>
         <div class="answers">${answers.join("")}</div>`
      );
    });

    quizContainer.innerHTML = output.join("");
  }

  function showResults(questions) {
    const answerContainers = quizContainer.querySelectorAll(".answers");
    let numCorrect = 0;
    let feedback = "";

    questions.forEach((q, index) => {
      const answerContainer = answerContainers[index];
      const selector = `input[name=question${index}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      if (userAnswer === q.correctAnswer) {
        numCorrect++;
        feedback += `<p>✔️ Q${index + 1}: Correct</p>`;
      } else {
        feedback += `<p>❌ Q${index + 1}: Incorrect – Correct answer is ${q.correctAnswer}: ${q.answers[q.correctAnswer]}</p>`;
      }
    });

    resultsContainer.innerHTML = `
      <h3>You got ${numCorrect} out of ${questions.length} correct.</h3>
      ${feedback}
    `;
  }
});
