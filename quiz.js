const quizContainer = document.getElementById("quizContainer");
const daySelect = document.getElementById("daySelect");

// Utility to get today's date string
function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Load last 3 days of quizzes
function loadAvailableDays() {
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    const option = document.createElement("option");
    option.value = dateString;
    option.textContent = dateString;
    daySelect.appendChild(option);
  }
  daySelect.value = getTodayDateString();
  loadQuiz(daySelect.value);
}

daySelect.addEventListener("change", () => {
  loadQuiz(daySelect.value);
});

function loadQuiz(dateStr) {
  quizContainer.innerHTML = "<p>Loading...</p>";
  firebase.database().ref(`quizzes/${dateStr}`).once("value")
    .then(snapshot => {
      const questions = snapshot.val();
      if (!questions) {
        quizContainer.innerHTML = `<p>No quiz found for ${dateStr}</p>`;
        return;
      }
      renderQuestions(questions);
    })
    .catch(err => {
      console.error("Error loading quiz:", err);
      quizContainer.innerHTML = `<p>Error loading quiz data.</p>`;
    });
}

function renderQuestions(questions) {
  quizContainer.innerHTML = "";
  questions.forEach((q, index) => {
    const box = document.createElement("div");
    box.className = "question-box";

    const qText = document.createElement("p");
    qText.innerHTML = `<strong>Q${index + 1}:</strong> ${q.question}`;
    box.appendChild(qText);

    const optionBox = document.createElement("div");
    optionBox.className = "options";

    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => {
        btn.classList.add(option === q.correctAnswer ? "correct" : "wrong");
        if (option !== q.correctAnswer) {
          [...optionBox.children].forEach(b => {
            if (b.textContent === q.correctAnswer) {
              b.classList.add("correct");
            }
            b.disabled = true;
          });
        } else {
          [...optionBox.children].forEach(b => b.disabled = true);
        }

        const expl = document.createElement("div");
        expl.className = "explanation";
        expl.textContent = "Explanation: " + q.explanation;
        box.appendChild(expl);
      };
      optionBox.appendChild(btn);
    });

    box.appendChild(optionBox);
    quizContainer.appendChild(box);
  });
}

// Start
loadAvailableDays();
