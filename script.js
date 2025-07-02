async function loadQuiz() {
  try {
    const response = await fetch('questions.json');
    const allQuestions = await response.json();

    const today = new Date().toISOString().split("T")[0];
    const seed = today.split("-").join(""); // e.g. 20250702
    const questions = pickDeterministicRandom(allQuestions, 5, seed);

    displayQuestions(questions);
  } catch (error) {
    console.error("Error loading quiz:", error);
    document.getElementById("quiz-container").innerHTML = "<p>Error loading quiz.</p>";
  }
}

function displayQuestions(questions) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question";

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${q.question}`;
    div.appendChild(questionText);

    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => {
        if (btn.textContent === q.answer) {
          btn.style.backgroundColor = "lightgreen";
        } else {
          btn.style.backgroundColor = "salmon";
        }
      };
      div.appendChild(btn);
    });

    container.appendChild(div);
  });
}

function pickDeterministicRandom(array, count, seed) {
  const seededRand = mulberry32(parseInt(seed));
  const copy = [...array];
  const result = [];
  while (result.length < count && copy.length) {
    const index = Math.floor(seededRand() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

loadQuiz();
