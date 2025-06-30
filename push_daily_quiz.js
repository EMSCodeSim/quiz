const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account key
const serviceAccount = require("./firebase-service-account.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Load full question bank
const questionBankPath = path.join(__dirname, "question_bank_1500.json");
const questionBank = JSON.parse(fs.readFileSync(questionBankPath, "utf8"));

// Format today's date as YYYY-MM-DD
const todayKey = new Date().toISOString().split("T")[0];

// Randomly shuffle and get 5 questions
const getRandomQuestions = () => {
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

// Upload quiz to Firebase
const uploadQuiz = async () => {
  const quiz = getRandomQuestions();
  const refPath = `daily_quizzes/${todayKey}`;
  await db.ref(refPath).set(quiz);
  console.log(`✅ Pushed quiz for ${todayKey} to ${refPath}`);
};

uploadQuiz().catch((err) => {
  console.error("❌ Failed to push quiz:", err);
});
