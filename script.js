let questionsData = [];
let selectedQuestions = [];
const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultMessage = document.getElementById('result-message');

// Load all questions
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questionsData = data;
    loadTodaysQuestions();
    renderQuiz();
  })
  .catch(error => {
    quizContainer.innerHTML = '<p>Error loading questions.</p>';
    console.error('Failed to load questions:', error);
  });

// Load or pick today's 5 unique questions
function loadTodaysQuestions() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('dailyQuiz'));

  if (stored && stored.date === today) {
    selectedQuestions = stored.questions;
  } else {
    selectedQuestions = pickUniqueQuestions(5);
    localStorage.setItem('dailyQuiz', JSON.stringify({
      date: today,
      questions: selectedQuestions
    }));
  }
}

// Picks N unique random questions
function pickUniqueQuestions(n) {
  const usedIndexes = new Set();
  const result = [];
  const maxTries = 1000;
  let tries = 0;

  while (result.length < n && tries < maxTries) {
    const index = Math.floor(Math.random() * questionsData.length);
    const question = questionsData[index];
    const questionText = question.question.trim();

    if (!usedIndexes.has(questionText)) {
      usedIndexes.add(questionText);
      result.push(question);
    }
    tries++;
  }

  return result;
}

// Render the quiz
function renderQuiz() {
  quizContainer.innerHTML = '';
  selectedQuestions.forEach((q, i) => {
    const qBox = document.createElement('div');
    qBox.className = 'question-container';
    qBox.innerHTML = `
      <div class="question-text">${i + 1}. ${q.question}</div>
      <div class="answers">
        ${q.choices.map((choice, j) => `
          <label>
            <input type="radio" name="question${i}" value="${choice}">
            ${choice}
          </label>
        `).join('')}
      </div>
    `;
    quizContainer.appendChild(qBox);
  });

  submitBtn.style.display = 'block';
  submitBtn.disabled = false;
  submitBtn.onclick = checkAnswers;
}

// Check answers and show result
function checkAnswers() {
  let correctCount = 0;
  const containers = document.querySelectorAll('.question-container');

  selectedQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="question${i}"]:checked`);
    const labels = containers[i].querySelectorAll('label');

    labels.forEach(label => {
      const input = label.querySelector('input');
      if (input.value === q.answer) {
        label.classList.add('correct');
      }
      if (input.checked && input.value !== q.answer) {
        label.classList.add('incorrect');
      }
    });

    if (selected && selected.value === q.answer) {
      correctCount++;
    }
  });

  resultMessage.textContent = `You got ${correctCount} out of ${selectedQuestions.length} correct. Come back tomorrow for 5 new questions!`;
  submitBtn.disabled = true;
}
