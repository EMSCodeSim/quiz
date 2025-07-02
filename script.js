let questionsData = [];
let selectedQuestions = [];
const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultMessage = document.getElementById('result-message');

// Load questions from JSON
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

// Use today's date as a seed to consistently pick 5 questions
function loadTodaysQuestions() {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const storedData = JSON.parse(localStorage.getItem('dailyQuiz'));

  if (storedData && storedData.date === today) {
    selectedQuestions = storedData.questions;
  } else {
    selectedQuestions = pickRandomQuestions(5);
    localStorage.setItem('dailyQuiz', JSON.stringify({
      date: today,
      questions: selectedQuestions
    }));
  }
}

// Fisher-Yates shuffle for randomness
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(seedRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Seedable pseudo-random number generator (daily consistent)
let seed = new Date().toISOString().split('T')[0].split('-').join('');
function seedRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function pickRandomQuestions(count) {
  const shuffled = shuffleArray([...questionsData]);
  return shuffled.slice(0, count);
}

function renderQuiz() {
  quizContainer.innerHTML = '';
  selectedQuestions.forEach((q, index) => {
    const questionBox = document.createElement('div');
    questionBox.className = 'question-container';
    questionBox.innerHTML = `
      <div class="question-text">${index + 1}. ${q.question}</div>
      <div class="answers">
        ${q.choices.map((choice, i) => `
          <label>
            <input type="radio" name="question${index}" value="${choice}">
            ${choice}
          </label>
        `).join('')}
      </div>
    `;
    quizContainer.appendChild(questionBox);
  });

  submitBtn.style.display = 'block';
  submitBtn.onclick = checkAnswers;
}

function checkAnswers() {
  let correctCount = 0;
  const containers = document.querySelectorAll('.question-container');

  selectedQuestions.forEach((q, index) => {
    const selectedInput = document.querySelector(`input[name="question${index}"]:checked`);
    const labels = containers[index].querySelectorAll('label');

    labels.forEach(label => {
      const input = label.querySelector('input');
      if (input.value === q.answer) {
        label.classList.add('correct');
      }
      if (input.checked && input.value !== q.answer) {
        label.classList.add('incorrect');
      }
    });

    if (selectedInput && selectedInput.value === q.answer) {
      correctCount++;
    }
  });

  resultMessage.textContent = `You got ${correctCount} out of ${selectedQuestions.length} correct. Come back tomorrow for 5 new questions!`;
  submitBtn.disabled = true;
}
