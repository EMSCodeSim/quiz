const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json"); // Add your Firebase key

const questionBank = require("../../questionBank.json"); // Your 1000+ Qs

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
});

const db = admin.database();

exports.handler = async function (event, context) {
  const today = new Date().toISOString().split("T")[0];
  const selected = shuffleArray(questionBank).slice(0, 5);
  const payload = {};
  selected.forEach((q, i) => payload[i] = q);

  await db.ref(`quizzes/${today}`).set(payload);
  console.log(`Quiz for ${today} uploaded`);

  return {
    statusCode: 200,
    body: "Quiz uploaded"
  };
};

exports.config = {
  schedule: "@daily" // Runs at midnight UTC every day
};

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
