function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

async function loadQuiz() {
  const quizContainer = document.getElementById("quiz-container");
  try {
    const response = await fetch("quizzes/daily_quiz.json");
    const data = await response.json();
    const todayKey = getTodayKey();

    const todayQuiz = data[todayKey];
    if (!todayQuiz) {
      quizContainer.innerHTML = `<p>No quiz found for today: ${todayKey}</p>`;
      return;
    }

    quizContainer.innerHTML = "";
    todayQuiz.forEach((q, index) => {
      const div = document.createElement("div");
      div.className = "question";
      div.innerHTML = `<strong>Q${index + 1}:</strong> ${q.question}`;
      const choicesDiv = document.createElement("div");
      choicesDiv.className = "choices";

      q.choices.forEach((choice, i) => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => {
          const result = div.querySelector(".result");
          if (choice === q.answer) {
            result.textContent = "✅ Correct!";
            result.style.color = "green";
          } else {
            result.textContent = `❌ Incorrect. Correct answer: ${q.answer}`;
            result.style.color = "red";
          }
        };
        choicesDiv.appendChild(btn);
      });

      const resultP = document.createElement("p");
      resultP.className = "result";
      div.appendChild(choicesDiv);
      div.appendChild(resultP);
      quizContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading quiz:", error);
    quizContainer.innerHTML = "<p>Error loading quiz data.</p>";
  }
}

loadQuiz();
