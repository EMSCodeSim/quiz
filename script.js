let quizData = [];
let userAnswers = {};

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    quizData = data.sort(() => 0.5 - Math.random()).slice(0, 5);
    displayQuiz();
  })
  .catch(error => {
    document.getElementById("quizContainer").innerHTML = "Failed to load quiz.";
    console.error(error);
  });

function displayQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  quizData.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    const qText = document.createElement("div");
    qText.className = "question-text";
    qText.textContent = `${index + 1}. ${q.question}`;
    card.appendChild(qText);

    q.options.forEach((opt, i) => {
      const optionDiv = document.createElement("label");
      optionDiv.className = "option";
      optionDiv.innerHTML = `
        <input type="radio" name="q${index}" value="${i}">
        <span>${String.fromCharCode(65 + i)}. ${opt}</span>
      `;
      card.appendChild(optionDiv);
    });

    container.appendChild(card);
  });
}

document.getElementById("submitBtn").addEventListener("click", () => {
  let correct = 0;

  quizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const options = document.getElementsByName(`q${index}`);
    const card = options[0].closest(".question-card");

    if (selected) {
      const selectedIndex = parseInt(selected.value);
      const correctIndex = q.answer;

      const optionDivs = card.querySelectorAll(".option");

      optionDivs.forEach((div, i) => {
        div.classList.remove("correct", "incorrect");
        if (i === correctIndex) div.classList.add("correct");
        if (i === selectedIndex && i !== correctIndex) div.classList.add("incorrect");
      });

      if (selectedIndex === correctIndex) correct++;
    } else {
      card.querySelectorAll(".option")[q.answer].classList.add("correct");
    }
  });

  const result = document.getElementById("result");
  result.innerHTML = `✅ You got ${correct} out of ${quizData.length} correct.<br>📅 Come back tomorrow for more questions!`;

  document.getElementById("submitBtn").disabled = true;
});
