function mulberry32(seed) {
  return function() {
    var t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function getTodaySeed() {
  const today = new Date().toISOString().split('T')[0];
  return parseInt(today.replace(/-/g, ''));
}

function pickRandomFromCategory(rng, categoryArray) {
  const index = Math.floor(rng() * categoryArray.length);
  return categoryArray[index];
}

fetch('ems_quiz_2000.json')
  .then(res => res.json())
  .then(data => {
    const seed = getTodaySeed();
    const rng = mulberry32(seed);

    const dailyQuiz = [];

    for (const category in data) {
      const question = pickRandomFromCategory(rng, data[category]);
      if (question) dailyQuiz.push(question);
    }

    startQuiz(dailyQuiz);
  })
  .catch(err => {
    document.getElementById("quiz").innerHTML = "<p>Error loading quiz.</p>";
    console.error(err);
  });
