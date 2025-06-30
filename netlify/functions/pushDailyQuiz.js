// pushDailyQuiz.js - Uploads 5 random quiz questions to Firebase under today's date

const admin = require("firebase-admin");
const questionBank = require("./questionBank.json"); // must be in same folder
const serviceAccount = require("./serviceAccountKey.json"); // must be in same folder

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
});

exports.handler = async function (event, context) {
  const today = new Date().toISOString().split("T")[0]; // e.g. 2025-06-30
  const ref = admin.database().ref(`/quizzes/${today}`);

  // Pick 5 random unique questions
  const selected = [];
  const usedIndexes = new Set();

  while (selected.length < 5 && usedIndexes.size < questionBank.length) {
    const i = Math.floor(Math.random() * questionBank.length);
    if (!usedIndexes.has(i)) {
      usedIndexes.add(i);
      selected.push(questionBank[i]);
    }
  }

  try {
    await ref.set(selected);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Uploaded ${selected.length} quiz questions for ${today}` })
    };
  } catch (error) {
    console.error("Firebase upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
