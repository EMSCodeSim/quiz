document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      const today = new Date().toISOString().slice(0, 10);
      const seed = parseInt(today.replace(/-/g, ""));
      const rng = mulberry32(seed);
      const shuffled = [...data].sort(() => rng() - 0.5);
      const questions = shuffled.slice(0, 5);
      displayQuestions(questions);
    })
    .catch(err => {
      document.getElementById("quiz-container").innerText = "Quiz not available.";
      console.error(err);
    });
});

function displayQuestions(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  questions.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.id = `question-${i}`;
    qDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;

    const letters = ["A", "B", "C", "D"];
    const choices = q.choices.map((choice, j) => `
      <label>
        <input type="radio" name="q${i}" value="${choice}">
        ${letters[j]}. ${choice}
        <span class="feedback-icon" id="feedback-q${i}-${j}"></span>
      </label>
    `).join("");

    const choiceDiv = document.createElement("div");
    choiceDiv.className = "choices";
    choiceDiv.innerHTML = choices;
    qDiv.appendChild(choiceDiv);

    const correctLine = document.createElement("div");
    correctLine.className = "correct-answer";
    correctLine.id = `correct-q${i}`;
    qDiv.appendChild(correctLine);

    container.appendChild(qDiv);
  });

  document.getElementById("submit-btn").style.display = "block";
  document.getElementById("submit-btn").onclick = () => checkAnswers(questions);
}

function checkAnswers(questions) {
  questions.forEach((q, i) => {
    const radios = document.querySelectorAll(`input[name="q${i}"]`);
    let selectedValue = null;

    radios.forEach((radio, j) => {
      const feedbackSpan = document.getElementById(`feedback-q${i}-${j}`);
      feedbackSpan.textContent = "";

      if (radio.checked) {
        selectedValue = radio.value;
        if (radio.value === q.answer) {
          feedbackSpan.textContent = "✅";
          feedbackSpan.className = "feedback-icon correct";
        } else {
          feedbackSpan.textContent = "❌";
          feedbackSpan.className = "feedback-icon incorrect";
        }
      }
    });

    if (selectedValue !== q.answer) {
      const correctLine = document.getElementById(`correct-q${i}`);
      correctLine.textContent = `Correct answer: ${q.answer}`;
    }
  });

  document.getElementById("submit-btn").disabled = true;
  document.getElementById("result").innerHTML = `<p><strong>📅 Come back tomorrow for 5 new questions!</strong></p>`;
}

// Deterministic RNG
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
