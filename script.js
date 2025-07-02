function displayQuestions(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question-card";

    const questionText = document.createElement("h2");
    questionText.textContent = `${index + 1}. ${q.question}`;
    card.appendChild(questionText);

    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-button";
      btn.textContent = choice;
      btn.onclick = () => {
        if (btn.textContent === q.answer) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("incorrect");
        }

        // Disable all buttons for this question
        Array.from(card.querySelectorAll("button")).forEach(b => b.disabled = true);
      };
      card.appendChild(btn);
    });

    container.appendChild(card);
  });
}
