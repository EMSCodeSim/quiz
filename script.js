document.addEventListener("DOMContentLoaded", () => {
  fetch('quizzes/daily_quiz.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("quiz-container");
      data.questions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.classList.add("question");
        div.innerHTML = `
          <p><strong>Q${idx + 1}:</strong> ${q.question}</p>
          ${q.choices.map((choice, i) => `
            <label>
              <input type="radio" name="q${idx}" value="${choice}">
              ${choice}
            </label><br>
          `).join("")}
        `;
        container.appendChild(div);
      });

      document.getElementById("submit-btn").onclick = () => {
        let score = 0;
        data.questions.forEach((q, idx) => {
          const selected = document.querySelector(`input[name="q${idx}"]:checked`);
          if (selected && selected.value === q.answer) {
            score++;
          }
        });
        document.getElementById("results").innerHTML = 
          `<p>You scored ${score} out of ${data.questions.length}</p>`;
      };
    })
    .catch(() => {
      document.getElementById("quiz-container").innerHTML = "<p>Quiz not found.</p>";
    });
});
