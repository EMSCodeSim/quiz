async function loadQuiz() {
  const container = document.getElementById("quiz-container");

  try {
    const response = await fetch("quizzes/daily_quiz.json");
    const questions = await response.json();

    if (!questions || questions.length === 0) {
      container.innerHTML = "<p>No quiz found for today.</p>";
      return;
    }

    let quizHtml = "";
    questions.forEach((q, i) => {
      quizHtml += `
        <div class="question-box" id="question-${i}">
          <p><strong>Q${i + 1}:</strong> ${q.question}</p>
          <div class="options">
            ${q.options.map((opt, j) =>
              `<label><input type="radio" name="q${i}" value="${j}" /> ${opt}</label>`
            ).join('')}
          </div>
          <button onclick="checkAnswer(${i}, ${q.answer})">Check Answer</button>
          <div id="result-${i}"></div>
        </div>
      `;
    });

    container.innerHTML = quizHtml;
  } catch (err) {
    console.error("Quiz load error:", err);
    container.innerHTML = "<p>Error loading quiz.</p>";
  }
}

function checkAnswer(index, correctIndex) {
  const selected = document.querySelector(`input[name="q${index}"]:checked`);
  const result = document.getElementById(`result-${index}`);
  if (!selected) {
    result.innerHTML = "Please select an answer.";
    return;
  }

  const selectedVal = parseInt(selected.value);
  if (selectedVal === correctIndex) {
    result.innerHTML = "<span class='correct'>Correct!</span>";
  } else {
    result.innerHTML = "<span class='incorrect'>Incorrect. Try again.</span>";
  }
}

loadQuiz();
