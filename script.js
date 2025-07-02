const today = new Date().toISOString().slice(0, 10);

fetch('quizzes/daily_quiz.json')
  .then(res => {
    if (!res.ok) throw new Error('File not found');
    return res.json();
  })
  .then(data => {
    const questions = data[today];
    const container = document.getElementById('quiz-container');
    if (!questions || questions.length === 0) {
      container.innerHTML = 'No quiz found today.';
      return;
    }

    container.innerHTML = '';
    questions.forEach((q, index) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        ${q.choices.map((c, i) => `
          <label>
            <input type="radio" name="q${index}" value="${c}"> ${c}
          </label><br>
        `).join('')}
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById('quiz-container').innerHTML = 'Error loading quiz.';
    console.error(err);
  });
