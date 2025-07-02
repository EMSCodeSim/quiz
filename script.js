let questionsData = [];
let todaysQuestions = [];

function loadQuestions() {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questionsData = data;
      loadTodaysQuiz();
    })
    .catch(err => {
      document.getElementById("quiz-container").innerText = "Failed to load questions.";
      console.error(err);
    });
}

function loadTodaysQuiz() {
  const today = new Date().toISOString().split("T")[0];
  const savedQuiz = JSON.parse(localStorage.getItem("dailyQuiz"));

  if (savedQuiz && savedQuiz.date === today) {
    todaysQuestions = savedQuiz.questions;
  } else {
    todaysQuestions = pickUniqueQuestions(5);
    localStorage.setItem("dailyQuiz", JSON.stringify({ date: today, questions: todaysQuestions }));
  }

  displayQuiz();
}

function pickUniqueQuestions(n) {
  const indexes = Array.from({ length: questionsData.length }, (_, i) => i);

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  return indexes.slice(0, n).map(i => questionsData[i]);
}

function displayQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  todaysQuestions.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "question-box";
    div.innerHTML = `
      <p><strong>Q${idx + 1}:</strong> ${q.question}</p>
      <div class="choices">
        ${q.choices.map((choice, i) => `
          <label id="q${idx}a${i}">
            <input type="radio" name="q${idx}" value="${choice}"> ${choice}
          </label>`).join("")}
      </div>
    `;
    container.appendChild(div);
  });
}

function submitQuiz() {
  let score = 0;
  todaysQuestions.forEach((q, idx) => {
    const radios = document.getElementsByName(`q${idx}`);
    let selected = null;

    radios.forEach(r => {
      if (r.checked) selected = r.value;
    });

    q.choices.forEach((choice, i) => {
      const label = document.getElementById(`q${idx}a${i}`);
      label.classList.remove("correct", "incorrect");

      if (choice === q.answer) {
        if (selected === q.answer) {
          score++;
          label.classList.add("correct");
        } else if (selected === choice) {
          label.classList.add("incorrect");
        } else {
          // Show correct answer even if it wasn't selected
          label.classList.add("correct");
        }
      } else if (selected === choice) {
        label.classList.add("incorrect");
      }
    });
  });

  document.getElementById("result").innerHTML =
    `You scored ${score}/5<br>Come back tomorrow for more questions!`;
}

loadQuestions();
