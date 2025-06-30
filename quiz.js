const today = new Date().toISOString().split("T")[0]; // e.g. 2025-06-30
const quizRef = firebase.database().ref('/quizzes/' + today);

quizRef.once('value')
  .then(snapshot => {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";

    if (!snapshot.exists()) {
      quizContainer.innerHTML = "<p>No quiz found for today.</p>";
      return;
    }

    snapshot.forEach((childSnapshot, index) => {
      const question = childSnapshot.val();
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>Q${index + 1}:</strong> ${question.question}</p>
        <ul>
          ${question.choices.map(choice => `<li>${choice}</li>`).join("")}
        </ul>
      `;
      quizContainer.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Error loading quiz:", error);
    document.getElementById("quiz-container").innerHTML = "<p>Error loading quiz.</p>";
  });
