const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load question bank
const questions = JSON.parse(fs.readFileSync("question_bank_1500.json", "utf8"));

// Initialize Firebase
const serviceAccount = require("./firebase-service-account.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR-PROJECT-ID>.firebaseio.com"
});

const db = admin.database();

function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function pickRandomQuestions(count) {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function pushQuiz() {
  const dateKey = getTodayDateString();
  const quiz = pickRandomQuestions(5);
  await db.ref("daily_quizzes/" + dateKey).set(quiz);
  console.log("✅ Pushed quiz for", dateKey);
}

pushQuiz().catch(console.error);
