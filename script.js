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
    qDiv.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>`;
    const letters = ["A", "B", "C", "D"];
    const choices = q.choices.map((choice, j) => `
      <label>
        <input type="radio" name="q${i}" value="${choice}">
        ${letters[j]}. ${choice}
      </label>
    `).join("");
    const choiceDiv = document.createElement("div");
    choiceDiv.className = "choices";
    choiceDiv.innerHTML = choices;
    qDiv.appendChild(choiceDiv);
    container.appendChild(qDiv);
  });

  document.getElementById("submit-btn").style.display = "block";
  document.getElementById("submit-btn").onclick = () => checkAnswers(questions);
}

function checkAnswers(questions) {
  let score = 0;
  let output = "";

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const answer = q.answer;
    const isCorrect = selected && selected.value === answer;

    if (isCorrect) {
      output += `<p class="correct">✅ Q${i + 1} Correct</p>`;
      score++;
    } else {
      const wrong = selected ? selected.value : "No answer";
      output += `<p class="incorrect">❌ Q${i + 1} Incorrect (You chose: ${wrong})<br>✅ Correct: ${answer}</p>`;
    }
  });

  output += `<p><strong>You got ${score} out of ${questions.length} right.</strong></p>`;
  output += `<p>📅 Come back tomorrow for 5 new questions!</p>`;
  document.getElementById("result").innerHTML = output;
  document.getElementById("submit-btn").disabled = true;
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
